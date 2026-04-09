# 🛒 QuickKart — Instant Grocery Delivery Platform

A full-stack 3-tier grocery delivery web app inspired by Zepto, built with React, Node.js/Express, and MySQL.

---

## 📁 Project Structure

```
quickkart/
├── docker-compose.yml
├── database/
│   └── init.sql              # DB schema + seed data
├── backend/
│   ├── server.js
│   ├── .env
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       └── cartOrders.js
└── frontend/
    ├── public/index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── index.css
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── services/api.js
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   └── ProductCard.js
        └── pages/
            ├── Home.js
            ├── Products.js
            ├── ProductDetail.js
            ├── Cart.js
            ├── Checkout.js
            ├── Login.js
            ├── Register.js
            ├── Profile.js
            ├── Orders.js
            ├── VendorLogin.js
            ├── VendorRegister.js
            └── VendorDashboard.js
```

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MySQL: port 3306

### Option 2: Manual Setup

#### 1. Database
```bash
mysql -u root -p < database/init.sql
```

#### 2. Backend
```bash
cd backend
npm install
# Edit .env with your DB credentials
npm run dev    # dev mode
npm start      # production
```

#### 3. Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| User | user@quickkart.com | password |
| Vendor | vendor@quickkart.com | password |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/user/register | Register user |
| POST | /api/auth/user/login | Login user |
| GET | /api/auth/user/profile | Get user profile |
| PUT | /api/auth/user/profile | Update profile |
| POST | /api/auth/vendor/register | Register vendor |
| POST | /api/auth/vendor/login | Login vendor |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products (with filters) |
| GET | /api/products/:id | Get single product |
| GET | /api/products/categories | Get all categories |
| GET | /api/products/vendor/my-products | Vendor: get own products |
| POST | /api/products/vendor/create | Vendor: create product |
| PUT | /api/products/vendor/:id | Vendor: update product |
| DELETE | /api/products/vendor/:id | Vendor: delete product |

### Cart (User auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart/add | Add to cart |
| PUT | /api/cart/:id | Update quantity |
| DELETE | /api/cart/:id | Remove item |
| DELETE | /api/cart | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place order |
| GET | /api/orders | Get user orders |
| GET | /api/orders/:id | Get order detail |
| GET | /api/orders/vendor/all | Vendor: get orders |

---

## ✨ Features

### User
- JWT-based login/registration
- Browse products by category
- Search & filter (price, sort)
- Add to cart with real-time quantity controls
- Checkout with address + payment selection
- Order history with status tracking
- Profile management

### Vendor
- Separate auth system (role-based)
- Dashboard with stats (products, stock alerts, orders)
- Full product CRUD (add, edit, delete)
- Real-time stock management
- Order tracking per product
- Changes reflect instantly on user-facing product pages (polling every 15–30s)

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | #1a56db (Blue from logo) |
| Secondary | #f97316 (Orange from logo) |
| Font (headings) | Poppins |
| Font (body) | Nunito |
