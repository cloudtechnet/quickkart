import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('qk_token');
      localStorage.removeItem('qk_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  registerUser: (data) => api.post('/auth/user/register', data),
  loginUser: (data) => api.post('/auth/user/login', data),
  registerVendor: (data) => api.post('/auth/vendor/register', data),
  loginVendor: (data) => api.post('/auth/vendor/login', data),
  getProfile: () => api.get('/auth/user/profile'),
  updateProfile: (data) => api.put('/auth/user/profile', data),
};

// Products
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  // Vendor
  getVendorProducts: () => api.get('/products/vendor/my-products'),
  create: (data) => api.post('/products/vendor/create', data),
  update: (id, data) => api.put(`/products/vendor/${id}`, data),
  delete: (id) => api.delete(`/products/vendor/${id}`),
};

// Cart
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
};

// Orders
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getVendorOrders: () => api.get('/orders/vendor/all'),
};

export default api;
