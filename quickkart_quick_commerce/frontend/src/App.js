import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import VendorLogin from './pages/VendorLogin';
import VendorRegister from './pages/VendorRegister';
import VendorDashboard from './pages/VendorDashboard';

const ProtectedUser = ({ children }) => {
  const { isLoggedIn, isUser } = useAuth();
  if (!isLoggedIn()) return <Navigate to="/login" />;
  if (!isUser()) return <Navigate to="/vendor/dashboard" />;
  return children;
};

const ProtectedVendor = ({ children }) => {
  const { isLoggedIn, isVendor } = useAuth();
  if (!isLoggedIn()) return <Navigate to="/vendor/login" />;
  if (!isVendor()) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { isVendor } = useAuth();
  return (
    <>
      {!isVendor() && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/cart" element={<ProtectedUser><Cart /></ProtectedUser>} />
        <Route path="/checkout" element={<ProtectedUser><Checkout /></ProtectedUser>} />
        <Route path="/profile" element={<ProtectedUser><Profile /></ProtectedUser>} />
        <Route path="/orders" element={<ProtectedUser><Orders /></ProtectedUser>} />
        <Route path="/vendor/dashboard" element={<ProtectedVendor><VendorDashboard /></ProtectedVendor>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isVendor() && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} theme="colored" />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
