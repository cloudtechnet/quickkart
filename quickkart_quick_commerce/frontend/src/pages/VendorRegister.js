import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const VendorRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', shop_name: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.registerVendor(form);
      login(data.token, { ...data.vendor, role: 'vendor' });
      toast.success('Vendor account created! Welcome to QuickKart 🎉');
      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const fields = [
    ['name', 'Your Full Name', 'text', 'John Doe'],
    ['shop_name', 'Store / Shop Name', 'text', 'Fresh Mart'],
    ['email', 'Business Email', 'email', 'store@email.com'],
    ['password', 'Password', 'password', '••••••••'],
    ['phone', 'Business Phone', 'tel', '9999999999'],
    ['address', 'Store Address', 'text', 'Full address of your store'],
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#1a56db"/>
            <path d="M10 14h2l3 12h10l3-10H15" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="18" cy="29" r="2" fill="white"/><circle cx="26" cy="29" r="2" fill="white"/>
          </svg>
          <span style={s.logoText}>Quick<span style={{color:'#f97316'}}>Kart</span></span>
        </div>
        <div style={s.vendorBadge}>🏪 Vendor Portal</div>
        <h2 style={s.title}>Register Your Store</h2>
        <p style={s.sub}>Start selling on QuickKart today</p>

        <form onSubmit={handleSubmit}>
          {fields.map(([key, label, type, ph]) => (
            <div key={key} style={s.field}>
              <label style={s.label}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f=>({...f,[key]:e.target.value}))} style={s.input} placeholder={ph} required={key !== 'phone' && key !== 'address'} />
            </div>
          ))}
          <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Creating account...' : 'Register Store →'}</button>
        </form>

        <p style={s.footer}>Already a vendor? <Link to="/vendor/login" style={s.link}>Login here</Link></p>
        <p style={s.footer}>Customer? <Link to="/register" style={s.link}>User Registration</Link></p>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1a3a6b 100%)' },
  card: { background: 'white', borderRadius: 24, padding: 40, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, justifyContent: 'center' },
  logoText: { fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: '#1a56db' },
  vendorBadge: { background: 'linear-gradient(135deg,#f97316,#fbbf24)', color: 'white', padding: '5px 16px', borderRadius: 100, fontSize: 12, fontWeight: 800, display: 'inline-block', marginBottom: 14 },
  title: { fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 24 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5 },
  input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontFamily: "'Nunito',sans-serif", color: '#0f172a', boxSizing: 'border-box' },
  btn: { width: '100%', background: 'linear-gradient(135deg,#1a56db,#0ea5e9)', color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", marginTop: 8 },
  footer: { textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 12 },
  link: { color: '#1a56db', fontWeight: 700 },
};

export default VendorRegister;
