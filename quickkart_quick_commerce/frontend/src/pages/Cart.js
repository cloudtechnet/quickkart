import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="spinner"><div className="spinner-ring"/></div>;

  if (!cart.items?.length) return (
    <div style={s.empty}>
      <div style={s.emptyIcon}>🛒</div>
      <h2 style={s.emptyTitle}>Your cart is empty</h2>
      <p style={s.emptySub}>Add some groceries to get started!</p>
      <Link to="/products" style={s.shopBtn}>Start Shopping</Link>
    </div>
  );

  const delivery = cart.total > 199 ? 0 : 29;
  const grandTotal = (parseFloat(cart.total) + delivery).toFixed(2);

  return (
    <div style={s.page}>
      <div className="container" style={s.layout}>
        <div style={s.main}>
          <h1 style={s.title}>My Cart <span style={s.count}>({cart.count} items)</span></h1>
          <div style={s.items}>
            {cart.items.map(item => (
              <div key={item.id} style={s.item}>
                <img src={item.image_url || 'https://via.placeholder.com/80'} alt={item.name} style={s.img} onError={e => { e.target.src = 'https://via.placeholder.com/80'; }} />
                <div style={s.itemInfo}>
                  <div style={s.itemName}>{item.name}</div>
                  <div style={s.itemUnit}>{item.unit}</div>
                  <div style={s.itemVendor}>by {item.vendor_name}</div>
                </div>
                <div style={s.itemQty}>
                  <button style={s.qBtn} onClick={() => updateItem(item.id, item.quantity - 1)}>−</button>
                  <span style={s.qNum}>{item.quantity}</span>
                  <button style={s.qBtn} onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                </div>
                <div style={s.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</div>
                <button style={s.removeBtn} onClick={() => removeItem(item.id)} title="Remove">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div style={s.summary}>
          <div style={s.summaryCard}>
            <h3 style={s.summaryTitle}>Order Summary</h3>
            <div style={s.summaryRow}><span>Subtotal</span><span>₹{cart.total}</span></div>
            <div style={s.summaryRow}><span>Delivery</span><span style={{ color: delivery === 0 ? '#22c55e' : undefined }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
            {delivery > 0 && <div style={s.freeShipping}>Add ₹{(199 - cart.total).toFixed(2)} more for free delivery</div>}
            <div style={s.divider}/>
            <div style={{ ...s.summaryRow, fontWeight: 800, fontSize: 18 }}><span>Total</span><span>₹{grandTotal}</span></div>
            <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>Proceed to Checkout →</button>
            <Link to="/products" style={s.continueLink}>← Continue Shopping</Link>
          </div>
          <div style={s.deliveryBadge}>⚡ Estimated delivery: 10 minutes</div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '32px 0 64px' },
  layout: { display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' },
  main: { flex: 1, minWidth: 300 },
  title: { fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 24 },
  count: { color: '#94a3b8', fontSize: 18, fontWeight: 600 },
  items: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { background: 'white', borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  img: { width: 72, height: 72, borderRadius: 12, objectFit: 'cover', background: '#f8faff' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 2 },
  itemUnit: { fontSize: 12, color: '#94a3b8' },
  itemVendor: { fontSize: 12, color: '#64748b' },
  itemQty: { display: 'flex', alignItems: 'center', gap: 0, background: '#1a56db', borderRadius: 8, overflow: 'hidden' },
  qBtn: { background: 'none', color: 'white', border: 'none', width: 32, height: 32, fontSize: 18, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qNum: { color: 'white', minWidth: 24, textAlign: 'center', fontWeight: 800, fontSize: 15 },
  itemPrice: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 16, color: '#0f172a', minWidth: 64, textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16, padding: 4 },
  summary: { width: 300, flexShrink: 0, position: 'sticky', top: 88 },
  summaryCard: { background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' },
  summaryTitle: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 20, color: '#0f172a' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#475569', marginBottom: 12, fontWeight: 600 },
  freeShipping: { background: '#fef3c7', color: '#b45309', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, marginBottom: 12 },
  divider: { height: 1, background: '#f1f5f9', margin: '16px 0' },
  checkoutBtn: { background: '#1a56db', color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 16, width: '100%', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", marginTop: 8, marginBottom: 12 },
  continueLink: { display: 'block', textAlign: 'center', color: '#64748b', fontSize: 14, fontWeight: 600 },
  deliveryBadge: { background: '#dbeafe', color: '#1a56db', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, textAlign: 'center', marginTop: 12 },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 12 },
  emptySub: { color: '#64748b', fontSize: 16, marginBottom: 28 },
  shopBtn: { display: 'inline-block', background: '#1a56db', color: 'white', padding: '12px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', fontFamily: "'Poppins', sans-serif" },
};

export default Cart;
