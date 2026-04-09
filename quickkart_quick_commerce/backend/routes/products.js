const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getCategories, getVendorProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authMiddleware, vendorOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Vendor routes
router.get('/vendor/my-products', authMiddleware, vendorOnly, getVendorProducts);
router.post('/vendor/create', authMiddleware, vendorOnly, createProduct);
router.put('/vendor/:id', authMiddleware, vendorOnly, updateProduct);
router.delete('/vendor/:id', authMiddleware, vendorOnly, deleteProduct);

module.exports = router;
