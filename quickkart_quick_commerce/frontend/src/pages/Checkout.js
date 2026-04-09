import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    payment_method: 'cod',
    notes: '',
  });

  const delivery = cart.total > 199 ? 0 : 29;
  const grandTotal = (parseFloat(cart.total || 0) + delivery).toFixed(2);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address.trim()) { toast.error('Please enter delivery address'); return; }
    setPlacing(true);
    try {
      const { data } = await orderAPI.create({ delivery_address: `${form.name}, ${form.phone}, ${form.address}`, payment_method: form.payment_method, notes: form.notes });
      setOrderId(data.order_id);
      setSuccess(true);
      clearCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Try again.');
    } finally { setPlacing(false); }
  };

  if (success) return (
    <div style={s.successPage}>
      <div style={s.successCard}>
        <div style={s.successIcon}>✅</div>
        <h2 style={s.successTitle}>Order Placed Successfully!</h2>
        <p style={s.successSub}>Order #{orderId} confirmed. Delivery in ~10 minutes.</p>
        <div style={s.successActions}>
          <button style={s.viewOrderBtn} onClick={() => navigate('/orders')}>View My Orders</button>
          <button style={s.shopMoreBtn} onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div className="container" style={s.layout}>
        <form onSubmit={handleSubmit} style={s.formSection}>
          <h1 style={s.title}>Checkout</h1>
          <div style={s.card}>
            <h3 style={s.cardTitle}>📍 Delivery Details</h3>
            {[['name', 'Full Name', 'text'], ['phone', 'Phone Number', 'tel'], ['address', 'Delivery Address', 'text']].map(([name, label, type]) => (
              <div key={name} style={s.field}>
                <label style={s.label}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handleChange} required style={s.input} placeholder={label} />
              </div>
            ))}
            <div style={s.field}>
              <label style={s.label}>Notes (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} style={s.textarea} placeholder="Any special instructions..." rows={3} />
            </div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>💳 Payment Method</h3>
            {[['cod', '💵 Cash on Delivery'], ['online', '💳 Online Payment (Mock)']].map(([val, label]) => (
              <label key={val} style={s.radioCard}>
                <input type="radio" name="payment_method" value={val} checked={form.payment_method === val} onChange={handleChange} style={{ accentColor: '#1a56db' }} />
                <span style={s.radioLabel}>{label}</span>
                {form.payment_method === val && <span style={s.radioCheck}>✓</span>}
              </label>
            ))}
          </div>

          <button type="submit" style={s.placeBtn} disabled={placing}>
            {placing ? 'Placing Order...' : `Place Order · ₹${grandTotal}`}
          </button>
        </form>

        <div style={s.summary}>
          <div style={s.summaryCard}>
            <h3 style={s.cardTitle}>Order Summary</h3>
            {cart.items?.map(item => (
              <div key={item.id} style={s.orderItem}>
                <img src={item.image_url} alt={item.name} style={s.itemImg} onError={e => { e.target.src = 'https://via.placeholder.com/44'; }} />
                <div style={s.itemInfo}><div style={s.itemName}>{item.name}</div><div style={s.itemQty}>×{item.quantity}</div></div>
                <div style={s.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div style={s.divider}/>
            <div style={s.row}><span>Subtotal</span><span>₹{cart.total}</span></div>
            <div style={s.row}><span>Delivery</span><span style={{ color: delivery === 0 ? '#22c55e' : undefined }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
            <div style={s.divider}/>
            <div style={{ ...s.row, fontWeight: 800, fontSize: 18, color: '#0f172a' }}><span>Total</span><span>₹{grandTotal}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '32px 0 64px' },
  layout: { display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' },
  formSection: { flex: 1, minWidth: 300 },
  title: { fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 24 },
  card: { background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  cardTitle: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontFamily: "'Nunito', sans-serif", color: '#0f172a', transition: 'border 0.2s' },
  textarea: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontFamily: "'Nunito', sans-serif", color: '#0f172a', resize: 'vertical' },
  radioCard: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: '2px solid #e2e8f0', marginBottom: 10, cursor: 'pointer' },
  radioLabel: { flex: 1, fontSize: 15, fontWeight: 600 },
  radioCheck: { color: '#22c55e', fontWeight: 800, fontSize: 18 },
  placeBtn: { background: '#1a56db', color: 'white', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 800, fontSize: 17, width: '100%', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  summary: { width: 320, flexShrink: 0, position: 'sticky', top: 88 },
  summaryCard: { background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' },
  orderItem: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  itemImg: { width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#f8faff' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: 700, color: '#0f172a' },
  itemQty: { fontSize: 12, color: '#94a3b8' },
  itemPrice: { fontSize: 14, fontWeight: 700, color: '#0f172a' },
  divider: { height: 1, background: '#f1f5f9', margin: '16px 0' },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#475569', fontWeight: 600, marginBottom: 10 },
  successPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 20px', minHeight: '60vh' },
  successCard: { background: 'white', borderRadius: 24, padding: 48, textAlign: 'center', maxWidth: 460, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  successIcon: { fontSize: 72, marginBottom: 20 },
  successTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 12 },
  successSub: { color: '#64748b', fontSize: 16, marginBottom: 32 },
  successActions: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  viewOrderBtn: { background: '#1a56db', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontSize: 15 },
  shopMoreBtn: { background: 'none', border: '2px solid #1a56db', color: '#1a56db', padding: '12px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontSize: 15 },
};

export default Checkout;
