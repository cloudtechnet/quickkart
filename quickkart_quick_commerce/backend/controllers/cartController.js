const { pool } = require('../config/db');

const getCart = async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.mrp, p.image_url, p.unit, p.stock,
             v.shop_name as vendor_name
      FROM cart c
      JOIN products p ON c.product_id = p.id
      JOIN vendors v ON p.vendor_id = v.id
      WHERE c.user_id = ? AND p.is_active = 1
    `, [req.user.id]);
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ items, total: total.toFixed(2), count: items.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const [product] = await pool.query('SELECT id, stock FROM products WHERE id = ? AND is_active = 1', [product_id]);
    if (!product.length) return res.status(404).json({ message: 'Product not found' });
    if (product[0].stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [req.user.id, product_id, quantity, quantity]
    );
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      return res.json({ message: 'Item removed from cart' });
    }
    await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
