const express = require('express');
const cartRouter = express.Router();
const orderRouter = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { createOrder, getUserOrders, getOrderById, getVendorOrders } = require('../controllers/orderController');
const { authMiddleware, userOnly, vendorOnly } = require('../middleware/auth');

// Cart
cartRouter.get('/', authMiddleware, userOnly, getCart);
cartRouter.post('/add', authMiddleware, userOnly, addToCart);
cartRouter.put('/:id', authMiddleware, userOnly, updateCartItem);
cartRouter.delete('/:id', authMiddleware, userOnly, removeFromCart);
cartRouter.delete('/', authMiddleware, userOnly, clearCart);

// Orders
orderRouter.post('/', authMiddleware, userOnly, createOrder);
orderRouter.get('/', authMiddleware, userOnly, getUserOrders);
orderRouter.get('/vendor/all', authMiddleware, vendorOnly, getVendorOrders);
orderRouter.get('/:id', authMiddleware, userOnly, getOrderById);

module.exports = { cartRouter, orderRouter };
