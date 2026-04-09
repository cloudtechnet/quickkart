import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const HERO_BANNERS = [
  { bg: 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 100%)', emoji: '🥦', title: 'Fresh Vegetables', sub: 'Farm to your door in 10 minutes', cta: 'Shop Vegetables', cat: 'fruits-vegetables' },
  { bg: 'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)', emoji: '🥛', title: 'Dairy & Eggs', sub: 'Fresh dairy delivered daily', cta: 'Shop Dairy', cat: 'dairy-eggs' },
  { bg: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)', emoji: '🍎', title: 'Fresh Fruits', sub: 'Seasonal fruits, best prices', cta: 'Shop Fruits', cat: 'fruits-vegetables' },
];

const FEATURES = [
  { icon: '⚡', title: '10-Minute Delivery', desc: 'Ultra-fast delivery to your doorstep' },
  { icon: '🌿', title: '100% Fresh', desc: 'Sourced daily from local farms' },
  { icon: '💰', title: 'Best Prices', desc: 'Lowest prices guaranteed' },
  { icon: '🔒', title: 'Safe & Secure', desc: 'Contactless delivery always' },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([productAPI.getCategories(), productAPI.getAll({ sort: 'newest' })]);
        setCategories(catRes.data);
        setProducts(prodRes.data.slice(0, 12));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const hero = HERO_BANNERS[heroIdx];

  return (
    <div>
      {/* Hero */}
      <section style={{ ...s.hero, background: hero.bg }}>
        <div className="container" style={s.heroInner}>
          <div style={s.heroContent}>
            <div style={s.heroBadge}>⚡ Delivery in 10 minutes</div>
            <h1 style={s.heroTitle}>{hero.title}</h1>
            <p style={s.heroSub}>{hero.sub}</p>
            <div style={s.heroActions}>
              <button style={s.heroCta} onClick={() => navigate(`/products?category=${hero.cat}`)}>{hero.cta} →</button>
              <Link to="/products" style={s.heroSecond}>View All</Link>
            </div>
          </div>
          <div style={s.heroEmoji}>{hero.emoji}</div>
        </div>
        <div style={s.heroDots}>
          {HERO_BANNERS.map((_, i) => (
            <button key={i} style={{ ...s.dot, opacity: i === heroIdx ? 1 : 0.4 }} onClick={() => setHeroIdx(i)} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={s.features}>
        <div className="container" style={s.featGrid}>
          {FEATURES.map(f => (
            <div key={f.title} style={s.feat}>
              <div style={s.featIcon}>{f.icon}</div>
              <div><div style={s.featTitle}>{f.title}</div><div style={s.featDesc}>{f.desc}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={s.section}>
        <div className="container">
          <div style={s.sectionHead}><h2 style={s.sectionTitle}>Shop by Category</h2><Link to="/products" style={s.seeAll}>See all →</Link></div>
          <div style={s.catGrid}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`} style={s.catCard}>
                <div style={s.catIcon}>{cat.icon}</div>
                <div style={s.catName}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={s.section}>
        <div className="container">
          <div style={s.sectionHead}><h2 style={s.sectionTitle}>Fresh Arrivals</h2><Link to="/products" style={s.seeAll}>See all →</Link></div>
          {loading ? (
            <div className="spinner"><div className="spinner-ring"/></div>
          ) : (
            <div style={s.prodGrid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner CTA */}
      <section style={s.ctaBanner}>
        <div className="container" style={s.ctaInner}>
          <div>
            <h2 style={s.ctaTitle}>Are you a vendor? 🏪</h2>
            <p style={s.ctaSub}>List your products on QuickKart and reach thousands of customers.</p>
          </div>
          <Link to="/vendor/register" style={s.ctaBtn}>Start Selling →</Link>
        </div>
      </section>
    </div>
  );
};

const s = {
  hero: { padding: '60px 0 50px', position: 'relative', overflow: 'hidden', minHeight: 300 },
  heroInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  heroContent: { color: 'white', maxWidth: 500 },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, marginBottom: 20 },
  heroTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 44, fontWeight: 800, lineHeight: 1.15, marginBottom: 16 },
  heroSub: { fontSize: 18, opacity: 0.9, marginBottom: 28 },
  heroActions: { display: 'flex', gap: 16, alignItems: 'center' },
  heroCta: { background: 'white', color: '#1a56db', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  heroSecond: { color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: 15, textDecoration: 'underline' },
  heroEmoji: { fontSize: 100, opacity: 0.85, flexShrink: 0 },
  heroDots: { display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 },
  dot: { width: 8, height: 8, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', padding: 0 },
  features: { background: 'white', padding: '20px 0', borderBottom: '1px solid #f1f5f9' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 },
  feat: { display: 'flex', alignItems: 'center', gap: 12 },
  featIcon: { fontSize: 28, flexShrink: 0 },
  featTitle: { fontWeight: 700, fontSize: 14, color: '#0f172a' },
  featDesc: { fontSize: 12, color: '#64748b' },
  section: { padding: '48px 0' },
  sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  sectionTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: '#0f172a' },
  seeAll: { color: '#1a56db', fontWeight: 700, fontSize: 14 },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 16 },
  catCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 12px', background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', transition: 'all 0.2s', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  catIcon: { fontSize: 36, marginBottom: 10 },
  catName: { fontSize: 12, fontWeight: 700, color: '#0f172a', textAlign: 'center', lineHeight: 1.3 },
  prodGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 },
  ctaBanner: { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '48px 0', marginTop: 20 },
  ctaInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' },
  ctaTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 8 },
  ctaSub: { color: '#94a3b8', fontSize: 16 },
  ctaBtn: { background: '#f97316', color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: "'Poppins', sans-serif" },
};

export default Home;
