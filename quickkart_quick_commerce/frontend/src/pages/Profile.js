import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authAPI.getProfile().then(r => {
      setForm({ name: r.data.name, phone: r.data.phone || '', address: r.data.address || '' });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      const token = localStorage.getItem('qk_token');
      login(token, { ...user, name: form.name });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="spinner"><div className="spinner-ring"/></div>;

  return (
    <div style={s.page}>
      <div className="container" style={s.layout}>
        {/* Sidebar card */}
        <div style={s.sideCard}>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div style={s.userName}>{user?.name}</div>
          <div style={s.userEmail}>{user?.email}</div>
          <div style={s.roleBadge}>👤 Customer</div>
        </div>

        {/* Form */}
        <div style={s.formCard}>
          <h2 style={s.title}>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            {[['name','Full Name','text','John Doe'],['phone','Phone Number','tel','9999999999']].map(([key, label, type, ph]) => (
              <div key={key} style={s.field}>
                <label style={s.label}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} style={s.input} placeholder={ph} />
              </div>
            ))}
            <div style={s.field}>
              <label style={s.label}>Delivery Address</label>
              <textarea value={form.address} onChange={e => setForm(f => ({...f,address:e.target.value}))} style={s.textarea} rows={3} placeholder="Your full delivery address" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input type="email" value={user?.email} disabled style={{...s.input, background:'#f8faff', color:'#94a3b8'}} />
              <small style={s.hint}>Email cannot be changed</small>
            </div>
            <button type="submit" style={s.btn} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '40px 0 64px' },
  layout: { display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' },
  sideCard: { width: 240, background: 'white', borderRadius: 20, padding: 28, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', flexShrink: 0 },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#0ea5e9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, margin: '0 auto 16px' },
  userName: { fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#94a3b8', marginBottom: 16, wordBreak: 'break-all' },
  roleBadge: { display: 'inline-block', background: '#dbeafe', color: '#1d4ed8', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700 },
  formCard: { flex: 1, minWidth: 300, background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: '#0f172a', marginBottom: 28 },
  field: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 },
  input: { width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: 15, fontFamily: "'Nunito',sans-serif", color: '#0f172a', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: 15, fontFamily: "'Nunito',sans-serif", color: '#0f172a', resize: 'vertical', boxSizing: 'border-box' },
  hint: { fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'block' },
  btn: { background: '#1a56db', color: 'white', border: 'none', padding: '13px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" },
};

export default Profile;
