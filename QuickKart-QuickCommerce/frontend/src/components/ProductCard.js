import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart, updateItem, getItemQuantity, cart } = useCart();
  const { isLoggedIn, isUser } = useAuth();
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const cartItem = cart.items?.find(i => i.product_id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isLoggedIn() || !isUser()) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add'); }
    finally { setAdding(false); }
  };

  const handleQtyChange = async (e, newQty) => {
    e.preventDefault();
    if (newQty <= 0) {
      await updateItem(cartItem.id, 0);
    } else {
      await updateItem(cartItem.id, newQty);
    }
  };

  return (
    <Link to={`/products/${product.id}`} style={s.card}>
      <div style={s.imgWrap}>
        <img src={product.image_url || 'https://via.placeholder.com/300x200?text=Product'} alt={product.name} style={s.img} onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=Product'; }} />
        {discount > 0 && <div style={s.discBadge}>{discount}% OFF</div>}
        {product.stock <= 5 && product.stock > 0 && <div style={s.lowStock}>Only {product.stock} left!</div>}
      </div>
      <div style={s.body}>
        <div style={s.category}>{product.category_name || 'Grocery'}</div>
        <div style={s.name}>{product.name}</div>
        <div style={s.unit}>{product.unit}</div>
        <div style={s.priceRow}>
          <div>
            <span style={s.price}>₹{Number(product.price).toFixed(0)}</span>
            {product.mrp && <span style={s.mrp}>₹{Number(product.mrp).toFixed(0)}</span>}
          </div>
          {qty > 0 ? (
            <div style={s.qtyCtrl} onClick={e => e.preventDefault()}>
              <button style={s.qtyBtn} onClick={e => handleQtyChange(e, qty - 1)}>−</button>
              <span style={s.qtyNum}>{qty}</span>
              <button style={s.qtyBtn} onClick={e => handleQtyChange(e, qty + 1)}>+</button>
            </div>
          ) : (
            <button style={s.addBtn} onClick={handleAdd} disabled={adding || product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : adding ? '...' : '+ Add'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

const s = {
  card: { display: 'block', background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', transition: 'all 0.22s', textDecoration: 'none', color: 'inherit', border: '1px solid #f1f5f9' },
  imgWrap: { position: 'relative', height: 170, overflow: 'hidden', background: '#f8faff' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  discBadge: { position: 'absolute', top: 10, left: 10, background: '#22c55e', color: 'white', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6 },
  lowStock: { position: 'absolute', bottom: 10, left: 10, background: '#f97316', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 },
  body: { padding: '14px 14px 16px' },
  category: { fontSize: 11, color: '#1a56db', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  name: { fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 3, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  unit: { fontSize: 12, color: '#94a3b8', marginBottom: 10 },
  priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 17, fontWeight: 800, color: '#0f172a', fontFamily: "'Poppins', sans-serif" },
  mrp: { fontSize: 12, color: '#94a3b8', textDecoration: 'line-through', marginLeft: 5 },
  addBtn: { background: '#1a56db', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.2s' },
  qtyCtrl: { display: 'flex', alignItems: 'center', gap: 2, background: '#1a56db', borderRadius: 8, overflow: 'hidden' },
  qtyBtn: { background: 'none', color: 'white', border: 'none', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, cursor: 'pointer' },
  qtyNum: { color: 'white', fontWeight: 800, minWidth: 22, textAlign: 'center', fontSize: 14 },
};

export default ProductCard;
