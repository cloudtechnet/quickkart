const { pool } = require('../config/db');

const getAllProducts = async (req, res) => {
  try {
    const { category, search, min_price, max_price, sort } = req.query;
    let query = `
      SELECT p.*, c.name as category_name, v.shop_name as vendor_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE p.is_active = 1 AND p.stock > 0
    `;
    const params = [];

    if (category) { query += ' AND c.slug = ?'; params.push(category); }
    if (search) { query += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (min_price) { query += ' AND p.price >= ?'; params.push(min_price); }
    if (max_price) { query += ' AND p.price <= ?'; params.push(max_price); }

    if (sort === 'price_asc') query += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY p.price DESC';
    else if (sort === 'newest') query += ' ORDER BY p.created_at DESC';
    else query += ' ORDER BY p.id DESC';

    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, v.shop_name as vendor_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = ? AND p.is_active = 1
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Vendor product management
const getVendorProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.vendor_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, mrp, stock, unit, image_url, category_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (vendor_id, category_id, name, description, price, mrp, stock, unit, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, category_id, name, description, price, mrp, stock, unit, image_url]
    );
    const [product] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [result.insertId]);
    res.status(201).json(product[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, mrp, stock, unit, image_url, category_id, is_active } = req.body;
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ? AND vendor_id = ?', [req.params.id, req.user.id]);
    if (!existing.length) return res.status(404).json({ message: 'Product not found or unauthorized' });

    await pool.query(
      'UPDATE products SET name=?, description=?, price=?, mrp=?, stock=?, unit=?, image_url=?, category_id=?, is_active=? WHERE id=? AND vendor_id=?',
      [name, description, price, mrp, stock, unit, image_url, category_id, is_active !== undefined ? is_active : 1, req.params.id, req.user.id]
    );
    const [product] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [req.params.id]);
    res.json(product[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ? AND vendor_id = ?', [req.params.id, req.user.id]);
    if (!existing.length) return res.status(404).json({ message: 'Product not found or unauthorized' });
    await pool.query('DELETE FROM products WHERE id = ? AND vendor_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllProducts, getProductById, getCategories, getVendorProducts, createProduct, updateProduct, deleteProduct };
