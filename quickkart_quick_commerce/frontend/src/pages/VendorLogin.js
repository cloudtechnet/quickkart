import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const VendorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.loginVendor(form);
      login(data.token, { ...data.vendor, role: 'vendor' });
      toast.success(`Welcome back, ${data.vendor.name}!`);
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoRow}>
          <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#1a56db"/>
            <path d="M10 14h2l3 12h10l3-10H15" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="18" cy="29" r="2" fill="white"/><circle cx="26" cy="29" r="2" fill="white"/>
          </svg>
          <span style={s.logoText}>Quick<span style={{color:'#f97316'}}>Kart</span></span>
        </div>

        <div style={s.vendorBadge}>🏪 Vendor Portal</div>
        <h2 style={s.title}>Vendor Login</h2>
        <p style={s.sub}>Access your vendor dashboard</p>

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Vendor Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} style={s.input} placeholder="vendor@store.com" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} style={s.input} placeholder="••••••••" required />
          </div>
          <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Logging in...' : 'Login to Dashboard →'}</button>
        </form>

        <div style={s.demo}>
          <button style={s.demoBtn} onClick={() => setForm({ email: 'vendor@quickkart.com', password: 'password' })}>
            🧪 Fill Demo Vendor Credentials
          </button>
        </div>

        <p style={s.footer}>New vendor? <Link to="/vendor/register" style={s.link}>Register your store</Link></p>
        <p style={s.footer}>Are you a customer? <Link to="/login" style={s.link}>User Login</Link></p>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1a3a6b 100%)' },
  card: { background: 'white', borderRadius: 24, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, justifyContent: 'center' },
  logoText: { fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 24, color: '#1a56db' },
  vendorBadge: { background: 'linear-gradient(135deg,#f97316,#fbbf24)', color: 'white', padding: '6px 18px', borderRadius: 100, fontSize: 13, fontWeight: 800, display: 'inline-block', marginBottom: 16 },
  title: { fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 6 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 28 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 },
  input: { width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: 15, fontFamily: "'Nunito',sans-serif", color: '#0f172a', boxSizing: 'border-box' },
  btn: { width: '100%', background: 'linear-gradient(135deg,#1a56db,#0ea5e9)', color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", marginTop: 4 },
  demo: { marginTop: 16, marginBottom: 4 },
  demoBtn: { width: '100%', background: '#f8faff', color: '#1a56db', border: '2px dashed #bfdbfe', padding: '11px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" },
  footer: { textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 14 },
  link: { color: '#1a56db', fontWeight: 700 },
};

export default VendorLogin;
