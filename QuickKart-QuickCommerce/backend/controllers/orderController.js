const { pool } = require('../config/db');

const createOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { delivery_address, payment_method = 'cod', notes } = req.body;

    // Get cart items
    const [cartItems] = await conn.query(`
      SELECT c.quantity, p.id as product_id, p.price, p.stock, p.vendor_id
      FROM cart c JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND p.is_active = 1
    `, [req.user.id]);

    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    // Check stock for all items
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        return res.status(400).json({ message: `Insufficient stock for some items` });
      }
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total_amount, delivery_address, payment_method, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, total, delivery_address, payment_method, 'confirmed']
    );
    const orderId = orderResult.insertId;

    // Insert order items and update stock
    for (const item of cartItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, vendor_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.vendor_id, item.quantity, item.price]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    // Clear cart
    await conn.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    await conn.commit();

    res.status(201).json({ message: 'Order placed successfully', order_id: orderId, total: total.toFixed(2) });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
};

const getUserOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    for (const order of orders) {
      const [items] = await pool.query(`
        SELECT oi.*, p.name, p.image_url, p.unit
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found' });

    const [items] = await pool.query(`
      SELECT oi.*, p.name, p.image_url, p.unit, v.shop_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN vendors v ON oi.vendor_id = v.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({ ...orders[0], items });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.id, o.status, o.created_at, o.total_amount, o.delivery_address,
             u.name as customer_name, u.phone as customer_phone,
             oi.quantity, oi.price, p.name as product_name
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN users u ON o.user_id = u.id
      JOIN products p ON oi.product_id = p.id
      WHERE oi.vendor_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, getVendorOrders };
