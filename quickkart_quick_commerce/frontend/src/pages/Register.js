import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.registerUser(form);
      login(data.token, data.user);
      toast.success('Account created! Welcome to QuickKart 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const fields = [
    ['name', 'Full Name', 'text', 'John Doe'],
    ['email', 'Email Address', 'email', 'you@email.com'],
    ['password', 'Password', 'password', '••••••••'],
    ['phone', 'Phone Number', 'tel', '9999999999'],
    ['address', 'Delivery Address', 'text', 'Your full address'],
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#1a56db"/><path d="M10 14h2l3 12h10l3-10H15" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="18" cy="29" r="2" fill="white"/><circle cx="26" cy="29" r="2" fill="white"/></svg>
          <span style={s.logoText}>Quick<span style={{ color: '#f97316' }}>Kart</span></span>
        </div>
        <h2 style={s.title}>Create account</h2>
        <p style={s.sub}>Join QuickKart for 10-minute grocery delivery</p>
        <form onSubmit={handleSubmit}>
          {fields.map(([name, label, type, ph]) => (
            <div key={name} style={s.field}>
              <label style={s.label}>{label}</label>
              <input type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} style={s.input} placeholder={ph} required={name !== 'phone' && name !== 'address'} />
            </div>
          ))}
          <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Creating account...' : 'Create Account →'}</button>
        </form>
        <p style={s.footer}>Already have an account? <Link to="/login" style={s.link}>Login</Link></p>
        <p style={s.footer}>Are you a vendor? <Link to="/vendor/register" style={s.link}>Register as Vendor</Link></p>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #dbeafe 0%, #f8faff 50%, #fff7ed 100%)' },
  card: { background: 'white', borderRadius: 24, padding: 40, width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, justifyContent: 'center' },
  logoText: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 24, color: '#1a56db' },
  title: { fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 6 },
  sub: { color: '#64748b', textAlign: 'center', fontSize: 14, marginBottom: 24 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5 },
  input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontFamily: "'Nunito', sans-serif", color: '#0f172a', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#1a56db', color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", marginTop: 8 },
  footer: { textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 14 },
  link: { color: '#1a56db', fontWeight: 700 },
};

export default Register;
