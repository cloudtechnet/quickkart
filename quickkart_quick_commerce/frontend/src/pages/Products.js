import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (category) params.category = category;
      if (search) params.search = search;
      const { data } = await productAPI.getAll(params);
      setProducts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [category, search, sort]);

  useEffect(() => {
    productAPI.getCategories().then(r => setCategories(r.data));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Poll every 30s for real-time updates
  useEffect(() => {
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const setCategory = (slug) => {
    const p = new URLSearchParams(searchParams);
    if (slug) p.set('category', slug); else p.delete('category');
    p.delete('search');
    setSearchParams(p);
  };

  return (
    <div style={s.page}>
      <div className="container" style={s.layout}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          <div style={s.filterCard}>
            <div style={s.filterTitle}>Categories</div>
            <button style={{ ...s.catBtn, ...(category === '' ? s.catBtnActive : {}) }} onClick={() => setCategory('')}>🛒 All Products</button>
            {categories.map(cat => (
              <button key={cat.id} style={{ ...s.catBtn, ...(category === cat.slug ? s.catBtnActive : {}) }} onClick={() => setCategory(cat.slug)}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          <div style={s.filterCard}>
            <div style={s.filterTitle}>Sort By</div>
            {[['newest', '🆕 Newest First'], ['price_asc', '💲 Price: Low to High'], ['price_desc', '💰 Price: High to Low']].map(([val, label]) => (
              <label key={val} style={s.radioLabel}>
                <input type="radio" name="sort" value={val} checked={sort === val} onChange={() => setSort(val)} style={{ accentColor: '#1a56db' }} />
                {label}
              </label>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main style={s.main}>
          <div style={s.mainHead}>
            <div>
              <h1 style={s.pageTitle}>{search ? `Results for "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}</h1>
              <p style={s.count}>{loading ? 'Loading...' : `${products.length} products`}</p>
            </div>
          </div>

          {loading ? (
            <div className="spinner"><div className="spinner-ring"/></div>
          ) : products.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>🔍</div>
              <h3>No products found</h3>
              <p>Try a different search or category.</p>
            </div>
          ) : (
            <div style={s.grid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '32px 0 64px' },
  layout: { display: 'flex', gap: 28, alignItems: 'flex-start' },
  sidebar: { width: 240, flexShrink: 0, position: 'sticky', top: 88 },
  filterCard: { background: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  filterTitle: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  catBtn: { display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569', marginBottom: 2, fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s' },
  catBtnActive: { background: '#dbeafe', color: '#1a56db', fontWeight: 800 },
  radioLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 10, cursor: 'pointer' },
  main: { flex: 1 },
  mainHead: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 },
  pageTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: '#0f172a' },
  count: { fontSize: 13, color: '#94a3b8', marginTop: 3 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#64748b' },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
};

export default Products;
