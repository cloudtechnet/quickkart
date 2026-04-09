const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, registerVendor, loginVendor } = require('../controllers/authController');
const { authMiddleware, userOnly } = require('../middleware/auth');

// User routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/profile', authMiddleware, userOnly, getProfile);
router.put('/user/profile', authMiddleware, userOnly, updateProfile);

// Vendor routes
router.post('/vendor/register', registerVendor);
router.post('/vendor/login', loginVendor);

module.exports = router;
