import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.loginUser(form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#1a56db"/><path d="M10 14h2l3 12h10l3-10H15" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="18" cy="29" r="2" fill="white"/><circle cx="26" cy="29" r="2" fill="white"/></svg>
          <span style={s.logoText}>Quick<span style={{ color: '#f97316' }}>Kart</span></span>
        </div>
        <h2 style={s.title}>Welcome back</h2>
        <p style={s.sub}>Login to your QuickKart account</p>

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={s.input} placeholder="you@email.com" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={s.input} placeholder="••••••••" required />
          </div>
          <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Logging in...' : 'Login →'}</button>
        </form>

        <div style={s.divider}><span>or</span></div>
        <div style={s.demo}>
          <button style={s.demoBtn} onClick={() => setForm({ email: 'user@quickkart.com', password: 'password' })}>Fill Demo Credentials</button>
        </div>

        <p style={s.footer}>
          New here? <Link to="/register" style={s.link}>Create account</Link>
        </p>
        <p style={s.footer}>
          Are you a vendor? <Link to="/vendor/login" style={s.link}>Vendor Login</Link>
        </p>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #dbeafe 0%, #f8faff 50%, #fff7ed 100%)' },
  card: { background: 'white', borderRadius: 24, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, justifyContent: 'center' },
  logoText: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 26, color: '#1a56db' },
  title: { fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 6 },
  sub: { color: '#64748b', textAlign: 'center', fontSize: 15, marginBottom: 28 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 },
  input: { width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: 15, fontFamily: "'Nunito', sans-serif", color: '#0f172a', transition: 'border 0.2s', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#1a56db', color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", marginTop: 4 },
  divider: { textAlign: 'center', margin: '20px 0', color: '#94a3b8', fontSize: 13, position: 'relative' },
  demo: { marginBottom: 16 },
  demoBtn: { width: '100%', background: '#f8faff', color: '#1a56db', border: '2px dashed #bfdbfe', padding: '11px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Nunito', sans-serif" },
  footer: { textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 16 },
  link: { color: '#1a56db', fontWeight: 700 },
};

export default Login;
