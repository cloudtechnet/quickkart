import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addToCart, cart, updateItem } = useCart();
  const { isLoggedIn, isUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getById(id).then(r => { setProduct(r.data); setLoading(false); }).catch(() => navigate('/products'));
  }, [id, navigate]);

  const cartItem = cart.items?.find(i => i.product_id === product?.id);
  const qty = cartItem ? cartItem.quantity : 0;
  const discount = product?.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const handleAdd = async () => {
    if (!isLoggedIn() || !isUser()) { navigate('/login'); return; }
    setAdding(true);
    try { await addToCart(product.id, 1); toast.success('Added to cart!'); }
    catch { toast.error('Failed to add'); }
    finally { setAdding(false); }
  };

  if (loading) return <div className="spinner"><div className="spinner-ring"/></div>;
  if (!product) return null;

  return (
    <div style={s.page}>
      <div className="container">
        <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
        <div style={s.card}>
          <div style={s.imgWrap}>
            <img src={product.image_url || 'https://via.placeholder.com/500x400?text=Product'} alt={product.name} style={s.img} onError={e => { e.target.src = 'https://via.placeholder.com/500x400?text=Product'; }} />
            {discount > 0 && <div style={s.badge}>{discount}% OFF</div>}
          </div>
          <div style={s.info}>
            <div style={s.catTag}>{product.category_name}</div>
            <h1 style={s.name}>{product.name}</h1>
            <div style={s.unit}>{product.unit}</div>
            {product.vendor_name && <div style={s.vendor}>Sold by: <strong>{product.vendor_name}</strong></div>}
            <div style={s.priceRow}>
              <span style={s.price}>₹{Number(product.price).toFixed(2)}</span>
              {product.mrp && <span style={s.mrp}>₹{Number(product.mrp).toFixed(2)}</span>}
              {discount > 0 && <span style={s.savings}>Save ₹{(product.mrp - product.price).toFixed(2)}</span>}
            </div>
            {product.description && <p style={s.desc}>{product.description}</p>}
            <div style={s.stock}>
              {product.stock > 0 ? (
                <span style={s.inStock}>✓ In Stock ({product.stock} available)</span>
              ) : (
                <span style={s.outStock}>✗ Out of Stock</span>
              )}
            </div>
            <div style={s.delivery}>⚡ Delivery in 10 minutes</div>
            {qty > 0 ? (
              <div style={s.qtyCtrl}>
                <button style={s.qtyBtn} onClick={() => updateItem(cartItem.id, qty - 1)}>−</button>
                <span style={s.qtyNum}>{qty} in cart</span>
                <button style={s.qtyBtn} onClick={() => updateItem(cartItem.id, qty + 1)}>+</button>
              </div>
            ) : (
              <button style={s.addBtn} onClick={handleAdd} disabled={adding || product.stock === 0}>
                {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : '🛒 Add to Cart'}
              </button>
            )}
            {qty > 0 && <button style={s.viewCart} onClick={() => navigate('/cart')}>View Cart →</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '32px 0 64px' },
  back: { background: 'none', border: 'none', color: '#1a56db', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 24, fontFamily: "'Nunito', sans-serif", display: 'flex', alignItems: 'center', gap: 4 },
  card: { background: 'white', borderRadius: 20, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  imgWrap: { position: 'relative', height: 420, background: '#f8faff', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  badge: { position: 'absolute', top: 16, left: 16, background: '#22c55e', color: 'white', padding: '6px 14px', borderRadius: 8, fontWeight: 800, fontSize: 14 },
  info: { padding: 40 },
  catTag: { fontSize: 12, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  name: { fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6, lineHeight: 1.25 },
  unit: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
  vendor: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  priceRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  price: { fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: '#0f172a' },
  mrp: { fontSize: 18, color: '#94a3b8', textDecoration: 'line-through' },
  savings: { background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: 8, fontSize: 13, fontWeight: 800 },
  desc: { fontSize: 15, color: '#475569', lineHeight: 1.7, marginBottom: 20 },
  stock: { marginBottom: 12 },
  inStock: { color: '#16a34a', fontWeight: 700, fontSize: 14 },
  outStock: { color: '#ef4444', fontWeight: 700, fontSize: 14 },
  delivery: { background: '#dbeafe', color: '#1a56db', padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 700, marginBottom: 24, display: 'inline-block' },
  addBtn: { background: '#1a56db', color: 'white', border: 'none', padding: '14px 36px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', width: '100%', fontFamily: "'Nunito', sans-serif", marginBottom: 12 },
  qtyCtrl: { display: 'flex', alignItems: 'center', gap: 0, background: '#1a56db', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  qtyBtn: { background: 'none', color: 'white', border: 'none', padding: '14px 24px', fontSize: 22, fontWeight: 800, cursor: 'pointer' },
  qtyNum: { color: 'white', fontWeight: 800, flex: 1, textAlign: 'center', fontSize: 16 },
  viewCart: { background: 'none', border: '2px solid #1a56db', color: '#1a56db', padding: '12px 36px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', width: '100%', fontFamily: "'Nunito', sans-serif" },
};

export default ProductDetail;
