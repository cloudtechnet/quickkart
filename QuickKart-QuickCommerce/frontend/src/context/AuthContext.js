import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('qk_token');
    const userData = localStorage.getItem('qk_user');
    if (token && userData) {
      try { setUser(JSON.parse(userData)); } catch { logout(); }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('qk_token', token);
    localStorage.setItem('qk_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('qk_token');
    localStorage.removeItem('qk_user');
    setUser(null);
  };

  const isVendor = () => user?.role === 'vendor';
  const isUser = () => user?.role === 'user';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isVendor, isUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
