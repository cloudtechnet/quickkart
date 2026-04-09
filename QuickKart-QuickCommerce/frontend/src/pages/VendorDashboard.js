import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TABS = ['dashboard', 'products', 'add-product', 'orders'];

const EMPTY_FORM = { name: '', description: '', price: '', mrp: '', stock: '', unit: 'kg', image_url: '', category_id: '' };

const STATUS_COLORS = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  out_for_delivery: '#10b981', delivered: '#22c55e', cancelled: '#ef4444',
};

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [pRes, oRes, cRes] = await Promise.all([
        productAPI.getVendorProducts(),
        orderAPI.getVendorOrders(),
        productAPI.getCategories(),
      ]);
      setProducts(pRes.data);
      setOrders(oRes.data);
      setCategories(cRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Real-time polling every 15s
  useEffect(() => {
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const startEdit = (product) => {
    setForm({
      name: product.name, description: product.description || '',
      price: product.price, mrp: product.mrp || '',
      stock: product.stock, unit: product.unit,
      image_url: product.image_url || '', category_id: product.category_id || '',
    });
    setEditId(product.id);
    setTab('add-product');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) { toast.error('Name, price and stock are required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await productAPI.update(editId, form);
        toast.success('Product updated! Changes are live ✓');
      } else {
        await productAPI.create(form);
        toast.success('Product added successfully!');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setTab('products');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchAll();
    } catch { toast.error('Failed to delete'); }
  };

  const handleLogout = () => { logout(); navigate('/vendor/login'); };

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + Number(o.price) * Number(o.quantity), 0);
  const activeProducts = products.filter(p => p.is_active).length;
  const lowStock = products.filter(p => p.stock <= 5).length;
  const todayOrders = orders.filter(o => {
    const d = new Date(o.created_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.logoRow}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1a56db"/>
              <path d="M10 14h2l3 12h10l3-10H15" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="18" cy="29" r="2" fill="white"/><circle cx="26" cy="29" r="2" fill="white"/>
            </svg>
            <span style={s.logoText}>Quick<span style={{color:'#f97316'}}>Kart</span></span>
          </div>
          <div style={s.vendorInfo}>
            <div style={s.vendorAvatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={s.vendorName}>{user?.name}</div>
              <div style={s.vendorShop}>{user?.shop_name || 'My Store'}</div>
            </div>
          </div>
        </div>

        <nav style={s.nav}>
          {[
            ['dashboard', '📊', 'Dashboard'],
            ['products', '📦', 'My Products'],
            ['add-product', '➕', 'Add Product'],
            ['orders', '🛒', 'Orders'],
          ].map(([key, icon, label]) => (
            <button
              key={key}
              style={{ ...s.navBtn, ...(tab === key ? s.navBtnActive : {}) }}
              onClick={() => { setTab(key); if (key === 'add-product') { setForm(EMPTY_FORM); setEditId(null); } }}
            >
              <span style={s.navIcon}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button style={s.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <div style={s.topBar}>
          <h1 style={s.pageTitle}>
            {tab === 'dashboard' && '📊 Dashboard Overview'}
            {tab === 'products' && '📦 My Products'}
            {tab === 'add-product' && (editId ? '✏️ Edit Product' : '➕ Add New Product')}
            {tab === 'orders' && '🛒 Customer Orders'}
          </h1>
          <div style={s.liveTag}>🟢 Live</div>
        </div>

        {loading ? (
          <div className="spinner"><div className="spinner-ring"/></div>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {tab === 'dashboard' && (
              <div>
                <div style={s.statsGrid}>
                  {[
                    { label: 'Total Products', value: products.length, icon: '📦', color: '#dbeafe', iconBg: '#1a56db' },
                    { label: 'Active Products', value: activeProducts, icon: '✅', color: '#dcfce7', iconBg: '#22c55e' },
                    { label: 'Low Stock Alert', value: lowStock, icon: '⚠️', color: '#fef3c7', iconBg: '#f59e0b' },
                    { label: "Today's Orders", value: todayOrders, icon: '🛒', color: '#f3e8ff', iconBg: '#a855f7' },
                  ].map(stat => (
                    <div key={stat.label} style={{ ...s.statCard, background: stat.color }}>
                      <div style={{ ...s.statIcon, background: stat.iconBg }}>{stat.icon}</div>
                      <div style={s.statValue}>{stat.value}</div>
                      <div style={s.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={s.dashGrid}>
                  {/* Recent products */}
                  <div style={s.dashCard}>
                    <div style={s.dashCardTitle}>Recent Products</div>
                    {products.slice(0, 5).map(p => (
                      <div key={p.id} style={s.dashItem}>
                        <img src={p.image_url || 'https://via.placeholder.com/40'} alt={p.name} style={s.dashItemImg} onError={e => { e.target.src = 'https://via.placeholder.com/40'; }} />
                        <div style={s.dashItemInfo}>
                          <div style={s.dashItemName}>{p.name}</div>
                          <div style={s.dashItemMeta}>₹{p.price} · Stock: {p.stock}</div>
                        </div>
                        <span style={{ ...s.activeDot, background: p.is_active && p.stock > 0 ? '#22c55e' : '#ef4444' }} />
                      </div>
                    ))}
                    <button style={s.dashSeeAll} onClick={() => setTab('products')}>See all products →</button>
                  </div>

                  {/* Low stock warnings */}
                  <div style={s.dashCard}>
                    <div style={s.dashCardTitle}>⚠️ Alerts</div>
                    {products.filter(p => p.stock <= 10).length === 0 ? (
                      <div style={s.noAlert}>✅ All products have healthy stock levels</div>
                    ) : products.filter(p => p.stock <= 10).map(p => (
                      <div key={p.id} style={s.alertItem}>
                        <div>
                          <div style={s.alertName}>{p.name}</div>
                          <div style={s.alertStock}>Only {p.stock} units left</div>
                        </div>
                        <button style={s.alertEditBtn} onClick={() => startEdit(p)}>Update Stock</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {tab === 'products' && (
              <div>
                <div style={s.prodHeader}>
                  <div style={s.prodCount}>{products.length} products</div>
                  <button style={s.addBtn} onClick={() => { setForm(EMPTY_FORM); setEditId(null); setTab('add-product'); }}>+ Add Product</button>
                </div>
                {products.length === 0 ? (
                  <div style={s.empty}><div style={{fontSize:56}}>📦</div><h3>No products yet</h3><p>Add your first product to start selling.</p></div>
                ) : (
                  <div style={s.prodTable}>
                    <div style={s.tableHead}>
                      <span style={{flex:2}}>Product</span>
                      <span style={{flex:1,textAlign:'center'}}>Category</span>
                      <span style={{flex:1,textAlign:'center'}}>Price</span>
                      <span style={{flex:1,textAlign:'center'}}>Stock</span>
                      <span style={{flex:1,textAlign:'center'}}>Status</span>
                      <span style={{flex:1,textAlign:'right'}}>Actions</span>
                    </div>
                    {products.map(p => (
                      <div key={p.id} style={s.tableRow}>
                        <div style={{flex:2,display:'flex',alignItems:'center',gap:12}}>
                          <img src={p.image_url || 'https://via.placeholder.com/48'} alt={p.name} style={s.rowImg} onError={e=>{e.target.src='https://via.placeholder.com/48';}} />
                          <div>
                            <div style={s.rowName}>{p.name}</div>
                            <div style={s.rowUnit}>{p.unit}</div>
                          </div>
                        </div>
                        <span style={{flex:1,textAlign:'center',fontSize:13,color:'#64748b'}}>{p.category_name || '—'}</span>
                        <div style={{flex:1,textAlign:'center'}}>
                          <div style={s.rowPrice}>₹{p.price}</div>
                          {p.mrp && <div style={s.rowMrp}>₹{p.mrp}</div>}
                        </div>
                        <div style={{flex:1,textAlign:'center'}}>
                          <span style={{...s.stockBadge, background: p.stock <= 5 ? '#fee2e2' : p.stock <= 20 ? '#fef3c7' : '#dcfce7', color: p.stock <= 5 ? '#dc2626' : p.stock <= 20 ? '#b45309' : '#16a34a'}}>{p.stock}</span>
                        </div>
                        <div style={{flex:1,textAlign:'center'}}>
                          <span style={{...s.statusDot, background: p.is_active && p.stock > 0 ? '#dcfce7' : '#fee2e2', color: p.is_active && p.stock > 0 ? '#16a34a' : '#dc2626'}}>
                            {p.is_active && p.stock > 0 ? 'Live' : 'Inactive'}
                          </span>
                        </div>
                        <div style={{flex:1,display:'flex',gap:8,justifyContent:'flex-end'}}>
                          <button style={s.editBtn} onClick={() => startEdit(p)}>Edit</button>
                          <button style={s.delBtn} onClick={() => handleDelete(p.id)}>Del</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADD/EDIT PRODUCT TAB */}
            {tab === 'add-product' && (
              <div style={s.formWrap}>
                <form onSubmit={handleSave} style={s.form}>
                  <div style={s.formGrid}>
                    <div style={s.field}>
                      <label style={s.label}>Product Name *</label>
                      <input name="name" value={form.name} onChange={handleFormChange} style={s.input} placeholder="e.g. Fresh Tomatoes" required />
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>Category</label>
                      <select name="category_id" value={form.category_id} onChange={handleFormChange} style={s.input}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                      </select>
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>Selling Price (₹) *</label>
                      <input name="price" type="number" value={form.price} onChange={handleFormChange} style={s.input} placeholder="0.00" step="0.01" min="0" required />
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>MRP / Original Price (₹)</label>
                      <input name="mrp" type="number" value={form.mrp} onChange={handleFormChange} style={s.input} placeholder="0.00" step="0.01" min="0" />
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>Stock Quantity *</label>
                      <input name="stock" type="number" value={form.stock} onChange={handleFormChange} style={s.input} placeholder="100" min="0" required />
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>Unit</label>
                      <select name="unit" value={form.unit} onChange={handleFormChange} style={s.input}>
                        {['kg','g','500g','250g','litre','ml','piece','dozen','pack','box','unit'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Product Image URL</label>
                    <input name="image_url" value={form.image_url} onChange={handleFormChange} style={s.input} placeholder="https://images.unsplash.com/..." />
                    {form.image_url && (
                      <div style={s.imgPreviewWrap}>
                        <img src={form.image_url} alt="Preview" style={s.imgPreview} onError={e => { e.target.style.display = 'none'; }} />
                        <span style={s.imgPreviewLabel}>Preview</span>
                      </div>
                    )}
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Description</label>
                    <textarea name="description" value={form.description} onChange={handleFormChange} style={s.textarea} rows={3} placeholder="Describe your product..." />
                  </div>
                  <div style={s.formActions}>
                    <button type="submit" style={s.saveBtn} disabled={saving}>{saving ? 'Saving...' : editId ? '✓ Update Product' : '+ Add Product'}</button>
                    <button type="button" style={s.cancelBtn} onClick={() => { setTab('products'); setForm(EMPTY_FORM); setEditId(null); }}>Cancel</button>
                  </div>
                  {editId && (
                    <div style={s.liveNote}>⚡ Changes will go live instantly on the customer product page</div>
                  )}
                </form>
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === 'orders' && (
              <div>
                <div style={s.orderCount}>{orders.length} order item(s) received</div>
                {orders.length === 0 ? (
                  <div style={s.empty}><div style={{fontSize:56}}>🛒</div><h3>No orders yet</h3><p>Orders from customers will appear here.</p></div>
                ) : (
                  <div style={s.ordersTable}>
                    <div style={s.orderHead}>
                      <span style={{flex:1}}>Order #</span>
                      <span style={{flex:2}}>Customer</span>
                      <span style={{flex:2}}>Product</span>
                      <span style={{flex:1,textAlign:'center'}}>Qty</span>
                      <span style={{flex:1,textAlign:'center'}}>Revenue</span>
                      <span style={{flex:1,textAlign:'center'}}>Status</span>
                      <span style={{flex:2}}>Date</span>
                    </div>
                    {orders.map((o, i) => (
                      <div key={i} style={s.orderRow}>
                        <span style={{flex:1,fontWeight:700,color:'#1a56db'}}>#{o.id}</span>
                        <div style={{flex:2}}>
                          <div style={s.custName}>{o.customer_name}</div>
                          <div style={s.custPhone}>{o.customer_phone}</div>
                        </div>
                        <span style={{flex:2,fontSize:14,fontWeight:600}}>{o.product_name}</span>
                        <span style={{flex:1,textAlign:'center',fontWeight:700}}>×{o.quantity}</span>
                        <span style={{flex:1,textAlign:'center',fontWeight:800,color:'#0f172a'}}>₹{(o.price * o.quantity).toFixed(2)}</span>
                        <span style={{flex:1,textAlign:'center'}}>
                          <span style={{...s.oStatus, background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status]}}>
                            {o.status?.replace(/_/g,' ')}
                          </span>
                        </span>
                        <span style={{flex:2,fontSize:12,color:'#94a3b8'}}>{new Date(o.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const s = {
  root: { display: 'flex', minHeight: '100vh', background: '#f8faff', fontFamily: "'Nunito',sans-serif" },
  sidebar: { width: 240, background: '#0f172a', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  sideTop: { padding: '0 20px 24px', borderBottom: '1px solid #1e293b' },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
  logoText: { fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, color: '#1a56db' },
  vendorInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  vendorAvatar: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#0ea5e9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 },
  vendorName: { fontWeight: 700, fontSize: 14, color: 'white' },
  vendorShop: { fontSize: 12, color: '#64748b' },
  nav: { flex: 1, padding: '16px 12px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', borderRadius: 12, background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s', fontFamily: "'Nunito',sans-serif", textAlign: 'left' },
  navBtnActive: { background: '#1a56db', color: 'white' },
  navIcon: { fontSize: 18, flexShrink: 0 },
  logoutBtn: { margin: '0 12px', padding: '11px 16px', borderRadius: 12, background: 'none', border: '1px solid #1e293b', color: '#64748b', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Nunito',sans-serif", textAlign: 'left', transition: 'all 0.2s' },
  main: { flex: 1, padding: '32px 36px', overflowY: 'auto' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  pageTitle: { fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 800, color: '#0f172a' },
  liveTag: { background: '#dcfce7', color: '#16a34a', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 800 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 },
  statCard: { borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  statIcon: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  statValue: { fontFamily: "'Poppins',sans-serif", fontSize: 32, fontWeight: 800, color: '#0f172a', lineHeight: 1 },
  statLabel: { fontSize: 13, color: '#64748b', fontWeight: 600 },
  dashGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  dashCard: { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  dashCardTitle: { fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 20 },
  dashItem: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  dashItemImg: { width: 44, height: 44, borderRadius: 10, objectFit: 'cover', background: '#f8faff' },
  dashItemInfo: { flex: 1 },
  dashItemName: { fontWeight: 700, fontSize: 14, color: '#0f172a' },
  dashItemMeta: { fontSize: 12, color: '#94a3b8' },
  activeDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  dashSeeAll: { background: 'none', border: 'none', color: '#1a56db', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 8, fontFamily: "'Nunito',sans-serif" },
  noAlert: { color: '#22c55e', fontWeight: 700, fontSize: 14, padding: '12px 0' },
  alertItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  alertName: { fontWeight: 700, fontSize: 14, color: '#0f172a' },
  alertStock: { fontSize: 12, color: '#ef4444', fontWeight: 600 },
  alertEditBtn: { background: '#fef3c7', color: '#b45309', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" },
  prodHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  prodCount: { fontSize: 14, color: '#64748b', fontWeight: 700 },
  addBtn: { background: '#1a56db', color: 'white', border: 'none', padding: '10px 22px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" },
  prodTable: { background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  tableHead: { display: 'flex', padding: '14px 20px', background: '#f8faff', borderBottom: '1px solid #f1f5f9', fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, gap: 8 },
  tableRow: { display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f8faff', gap: 8, transition: 'background 0.15s' },
  rowImg: { width: 44, height: 44, borderRadius: 10, objectFit: 'cover', background: '#f8faff', flexShrink: 0 },
  rowName: { fontWeight: 700, fontSize: 14, color: '#0f172a' },
  rowUnit: { fontSize: 12, color: '#94a3b8' },
  rowPrice: { fontWeight: 800, fontSize: 15, color: '#0f172a', fontFamily: "'Poppins',sans-serif" },
  rowMrp: { fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' },
  stockBadge: { padding: '3px 12px', borderRadius: 100, fontWeight: 800, fontSize: 13 },
  statusDot: { padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 800 },
  editBtn: { background: '#dbeafe', color: '#1d4ed8', border: 'none', padding: '6px 14px', borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" },
  delBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" },
  formWrap: { maxWidth: 760 },
  form: { background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  field: { marginBottom: 0 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontFamily: "'Nunito',sans-serif", color: '#0f172a', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontFamily: "'Nunito',sans-serif", color: '#0f172a', resize: 'vertical', boxSizing: 'border-box' },
  imgPreviewWrap: { marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 },
  imgPreview: { width: 80, height: 80, borderRadius: 10, objectFit: 'cover', border: '2px solid #e2e8f0' },
  imgPreviewLabel: { fontSize: 12, color: '#94a3b8', fontWeight: 600 },
  formActions: { display: 'flex', gap: 12, marginTop: 24 },
  saveBtn: { background: '#1a56db', color: 'white', border: 'none', padding: '13px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" },
  cancelBtn: { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '13px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" },
  liveNote: { marginTop: 16, background: '#dbeafe', color: '#1d4ed8', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700 },
  orderCount: { fontSize: 14, color: '#64748b', fontWeight: 700, marginBottom: 20 },
  ordersTable: { background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  orderHead: { display: 'flex', padding: '14px 20px', background: '#f8faff', borderBottom: '1px solid #f1f5f9', fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, gap: 8 },
  orderRow: { display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f8faff', gap: 8, fontSize: 14 },
  custName: { fontWeight: 700, fontSize: 14, color: '#0f172a' },
  custPhone: { fontSize: 12, color: '#94a3b8' },
  oStatus: { padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 800, textTransform: 'capitalize' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#64748b', background: 'white', borderRadius: 16 },
};

export default VendorDashboard;
