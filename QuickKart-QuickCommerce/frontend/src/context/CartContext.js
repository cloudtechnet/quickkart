import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(false);
  const { isUser } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isUser()) return;
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data);
    } catch { setCart({ items: [], total: 0, count: 0 }); }
    finally { setLoading(false); }
  }, [isUser]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product_id, quantity = 1) => {
    await cartAPI.add({ product_id, quantity });
    fetchCart();
  };

  const updateItem = async (id, quantity) => {
    await cartAPI.update(id, quantity);
    fetchCart();
  };

  const removeItem = async (id) => {
    await cartAPI.remove(id);
    fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCart({ items: [], total: 0, count: 0 });
  };

  const getItemQuantity = (productId) => {
    const item = cart.items?.find(i => i.product_id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, clearCart, fetchCart, getItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
