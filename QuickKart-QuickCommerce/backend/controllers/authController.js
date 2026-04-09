const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// USER AUTH
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, phone, address]
    );
    const token = generateToken({ id: result.insertId, email, role: 'user' });
    res.status(201).json({ token, user: { id: result.insertId, name, email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await pool.query('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?', [name, phone, address, req.user.id]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// VENDOR AUTH
const registerVendor = async (req, res) => {
  try {
    const { name, email, password, phone, shop_name, address } = req.body;
    const [existing] = await pool.query('SELECT id FROM vendors WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO vendors (name, email, password, phone, shop_name, address) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashed, phone, shop_name, address]
    );
    const token = generateToken({ id: result.insertId, email, role: 'vendor' });
    res.status(201).json({ token, vendor: { id: result.insertId, name, email, shop_name, role: 'vendor' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM vendors WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const vendor = rows[0];
    const valid = await bcrypt.compare(password, vendor.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: vendor.id, email: vendor.email, role: 'vendor' });
    res.json({ token, vendor: { id: vendor.id, name: vendor.name, email: vendor.email, shop_name: vendor.shop_name, role: 'vendor' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, registerVendor, loginVendor };
