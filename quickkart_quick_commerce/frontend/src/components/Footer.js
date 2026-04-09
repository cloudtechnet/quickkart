import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={s.footer}>
    <div className="container">
      <div style={s.grid}>
        <div style={s.brand}>
          <div style={s.logoRow}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1a56db"/>
              <path d="M10 14h2l3 12h10l3-10H15" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="18" cy="29" r="2" fill="white"/><circle cx="26" cy="29" r="2" fill="white"/>
            </svg>
            <span style={s.logoText}>Quick<span style={{color:'#f97316'}}>Kart</span></span>
          </div>
          <p style={s.tagline}>Groceries delivered to your door in minutes. Fresh, fast, and affordable.</p>
          <div style={s.delivery}>⚡ Delivery in 10 minutes</div>
        </div>
        <div>
          <div style={s.colTitle}>Quick Links</div>
          {[['/', 'Home'], ['/products', 'Shop All'], ['/cart', 'My Cart'], ['/orders', 'Orders']].map(([href, label]) => (
            <Link key={href} to={href} style={s.link}>{label}</Link>
          ))}
        </div>
        <div>
          <div style={s.colTitle}>Categories</div>
          {['Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Snacks', 'Beverages'].map(c => (
            <Link key={c} to={`/products?category=${c.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} style={s.link}>{c}</Link>
          ))}
        </div>
        <div>
          <div style={s.colTitle}>Vendor</div>
          <Link to="/vendor/login" style={s.link}>Vendor Login</Link>
          <Link to="/vendor/register" style={s.link}>Become a Vendor</Link>
          <Link to="/vendor/dashboard" style={s.link}>Dashboard</Link>
          <div style={s.colTitle} className="mt">Contact</div>
          <p style={s.contact}>📧 support@quickkart.com</p>
          <p style={s.contact}>📞 1800-123-4567</p>
        </div>
      </div>
      <div style={s.bottom}>
        <span>© 2024 QuickKart.com — All rights reserved</span>
        <span>Made with ❤️ in India</span>
      </div>
    </div>
  </footer>
);

const s = {
  footer: { background: '#0f172a', color: '#94a3b8', padding: '48px 0 0', marginTop: 60 },
  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 40 },
  brand: {},
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  logoText: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 24, color: '#1a56db' },
  tagline: { fontSize: 14, lineHeight: 1.7, maxWidth: 280, marginBottom: 16 },
  delivery: { display: 'inline-block', background: 'rgba(26,86,219,0.15)', color: '#60a5fa', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700 },
  colTitle: { color: 'white', fontWeight: 800, fontSize: 14, marginBottom: 14, fontFamily: "'Poppins', sans-serif", textTransform: 'uppercase', letterSpacing: 1 },
  link: { display: 'block', fontSize: 14, marginBottom: 8, color: '#94a3b8', transition: 'color 0.2s', textDecoration: 'none' },
  contact: { fontSize: 14, marginBottom: 6 },
  bottom: { borderTop: '1px solid #1e293b', padding: '20px 0', display: 'flex', justifyContent: 'space-between', fontSize: 13, flexWrap: 'wrap', gap: 8 },
};

export default Footer;
