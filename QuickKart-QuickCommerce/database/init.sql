-- QuickKart Database Schema

CREATE DATABASE IF NOT EXISTS quickkart_db;
USE quickkart_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  address TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  shop_name VARCHAR(100),
  address TEXT,
  role ENUM('vendor') DEFAULT 'vendor',
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendor_id INT NOT NULL,
  category_id INT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2),
  stock INT DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'unit',
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  payment_method ENUM('cod', 'online') DEFAULT 'cod',
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  vendor_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Seed categories
INSERT INTO categories (name, slug, icon) VALUES
('Fruits & Vegetables', 'fruits-vegetables', '🥦'),
('Dairy & Eggs', 'dairy-eggs', '🥛'),
('Bakery', 'bakery', '🍞'),
('Snacks', 'snacks', '🍿'),
('Beverages', 'beverages', '🥤'),
('Household', 'household', '🧹'),
('Personal Care', 'personal-care', '🧴'),
('Meat & Fish', 'meat-fish', '🐟'),
('Frozen Foods', 'frozen-foods', '🧊'),
('Breakfast', 'breakfast', '🥣');

-- Seed a demo vendor
INSERT INTO vendors (name, email, password, phone, shop_name, address) VALUES
('Demo Vendor', 'vendor@quickkart.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9999999999', 'QuickKart Store', 'Mumbai, Maharashtra');

-- Seed a demo user (password: password)
INSERT INTO users (name, email, password, phone, address) VALUES
('Demo User', 'user@quickkart.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '8888888888', 'Delhi, India');

-- Seed some products
INSERT INTO products (vendor_id, category_id, name, description, price, mrp, stock, unit, image_url) VALUES
(1, 1, 'Fresh Bananas', 'Farm fresh yellow bananas, rich in potassium', 49.00, 60.00, 100, '1 dozen', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'),
(1, 1, 'Red Apples', 'Juicy Shimla apples, handpicked', 120.00, 150.00, 80, '1 kg', 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=400'),
(1, 1, 'Fresh Tomatoes', 'Vine-ripened red tomatoes', 35.00, 45.00, 200, '500 g', 'https://images.unsplash.com/photo-1546470427-e26264be0b1c?w=400'),
(1, 1, 'Baby Spinach', 'Tender organic baby spinach leaves', 30.00, 40.00, 60, '200 g', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'),
(1, 2, 'Full Cream Milk', 'Fresh pasteurized full cream milk', 28.00, 32.00, 150, '500 ml', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
(1, 2, 'Amul Butter', 'Salted butter, rich and creamy', 55.00, 60.00, 90, '100 g', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
(1, 2, 'Paneer', 'Fresh cottage cheese, soft and creamy', 80.00, 95.00, 50, '200 g', 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400'),
(1, 3, 'Whole Wheat Bread', 'Soft whole wheat sandwich bread', 45.00, 55.00, 70, '400 g', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
(1, 4, 'Lay''s Classic Chips', 'Crispy potato chips, lightly salted', 20.00, 25.00, 200, '52 g', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'),
(1, 5, 'Tropicana Orange Juice', '100% pure pressed orange juice', 99.00, 120.00, 80, '1 L', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'),
(1, 1, 'Green Grapes', 'Seedless sweet green grapes', 90.00, 110.00, 60, '500 g', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400'),
(1, 1, 'Onions', 'Fresh red onions, essential for cooking', 25.00, 30.00, 300, '1 kg', 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400');
