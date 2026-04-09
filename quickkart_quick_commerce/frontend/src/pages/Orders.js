import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#b45309' },
  confirmed: { bg: '#dbeafe', color: '#1d4ed8' },
  processing: { bg: '#e0e7ff', color: '#4338ca' },
  out_for_delivery: { bg: '#dcfce7', color: '#16a34a' },
  delivered: { bg: '#d1fae5', color: '#065f46' },
  cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getAll().then(r => { setOrders(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="spinner"><div className="spinner-ring"/></div>;

  return (
    <div style={s.page}>
      <div className="container">
        <h1 style={s.title}>My Orders</h1>
        {orders.length === 0 ? (
          <div style={s.empty}><div style={s.emptyIcon}>📦</div><h3>No orders yet</h3><p>Place your first order and it'll appear here.</p></div>
        ) : (
          <div style={s.list}>
            {orders.map(order => {
              const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} style={s.card}>
                  <div style={s.cardHead} onClick={() => setExpanded(isOpen ? null : order.id)}>
                    <div>
                      <div style={s.orderId}>Order #{order.id}</div>
                      <div style={s.orderDate}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style={s.headRight}>
                      <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>{order.status.replace(/_/g, ' ').toUpperCase()}</span>
                      <div style={s.total}>₹{Number(order.total_amount).toFixed(2)}</div>
                      <span style={s.chevron}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div style={s.cardBody}>
                      <div style={s.itemCount}>{order.item_count} item(s)</div>
                      {order.items?.map(item => (
                        <div key={item.id} style={s.item}>
                          <img src={item.image_url} alt={item.name} style={s.itemImg} onError={e => { e.target.src = 'https://via.placeholder.com/48'; }} />
                          <div style={s.itemInfo}><div style={s.itemName}>{item.name}</div><div style={s.itemUnit}>{item.unit} × {item.quantity}</div></div>
                          <div style={s.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { padding: '32px 0 64px' },
  title: { fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 28 },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', cursor: 'pointer', gap: 16, flexWrap: 'wrap' },
  orderId: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 16, color: '#0f172a' },
  orderDate: { fontSize: 13, color: '#94a3b8', marginTop: 3 },
  headRight: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  statusBadge: { padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: 0.5 },
  total: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 16, color: '#0f172a' },
  chevron: { color: '#94a3b8', fontSize: 12 },
  cardBody: { borderTop: '1px solid #f1f5f9', padding: '16px 20px' },
  itemCount: { fontSize: 13, color: '#94a3b8', marginBottom: 12 },
  item: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
  itemImg: { width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: '#f8faff' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: 700, color: '#0f172a' },
  itemUnit: { fontSize: 12, color: '#94a3b8' },
  itemPrice: { fontSize: 14, fontWeight: 700, color: '#0f172a' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#64748b' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
};

export default Orders;
