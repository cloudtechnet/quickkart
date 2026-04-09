import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/products?search=${encodeURIComponent(searchQ)}`);
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1a56db"/>
              <path d="M10 14h2l3 12h10l3-10H15" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="18" cy="29" r="2" fill="white"/>
              <circle cx="26" cy="29" r="2" fill="white"/>
            </svg>
          </div>
          <span style={styles.logoText}>Quick<span style={{ color: '#f97316' }}>Kart</span></span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchWrap}>
            <svg style={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              style={styles.searchInput}
              placeholder="Search for groceries, fruits, veggies..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
            <button type="submit" style={styles.searchBtn}>Search</button>
          </div>
        </form>

        {/* Actions */}
        <nav style={styles.actions}>
          {isLoggedIn() ? (
            <>
              <Link to="/cart" style={styles.cartBtn}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {cart.count > 0 && <span style={styles.cartBadge}>{cart.count}</span>}
              </Link>
              <div style={styles.userMenu}>
                <button style={styles.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
                  <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6,9 12,15 18,9"/></svg>
                </button>
                {menuOpen && (
                  <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}><strong>{user?.name}</strong><small style={{color:'#64748b'}}>{user?.email}</small></div>
                    <Link to="/profile" style={styles.dropItem} onClick={() => setMenuOpen(false)}>👤 Profile</Link>
                    <Link to="/orders" style={styles.dropItem} onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
                    <div style={styles.dropDivider}/>
                    <button style={{...styles.dropItem, color:'#ef4444', width:'100%', textAlign:'left'}} onClick={handleLogout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Sign Up</Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: { background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 12px rgba(26,86,219,0.08)' },
  inner: { display: 'flex', alignItems: 'center', gap: 16, height: 68, maxWidth: 1280, margin: '0 auto', padding: '0 20px' },
  logo: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  logoIcon: {},
  logoText: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 22, color: '#1a56db', letterSpacing: '-0.5px' },
  searchForm: { flex: 1, maxWidth: 600 },
  searchWrap: { display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: 12, border: '2px solid transparent', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' },
  searchIcon: { position: 'absolute', left: 14, color: '#94a3b8' },
  searchInput: { flex: 1, border: 'none', background: 'transparent', padding: '10px 14px 10px 44px', fontSize: 14, fontFamily: "'Nunito', sans-serif", color: '#0f172a' },
  searchBtn: { background: '#1a56db', color: 'white', border: 'none', padding: '10px 20px', fontWeight: 700, fontSize: 14, fontFamily: "'Nunito', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' },
  actions: { display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  cartBtn: { position: 'relative', background: '#f1f5f9', border: 'none', borderRadius: 12, padding: '9px 12px', display: 'flex', alignItems: 'center', color: '#1a56db', cursor: 'pointer', transition: 'all 0.2s' },
  cartBadge: { position: 'absolute', top: -6, right: -6, background: '#f97316', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 },
  userMenu: { position: 'relative' },
  userBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: 'none', borderRadius: 12, padding: '6px 12px', cursor: 'pointer' },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: '#1a56db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 },
  dropdown: { position: 'absolute', right: 0, top: '110%', background: 'white', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 200, overflow: 'hidden', zIndex: 99 },
  dropdownHeader: { padding: '14px 16px 10px', display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9' },
  dropItem: { display: 'block', padding: '10px 16px', fontSize: 14, color: '#0f172a', fontWeight: 600, transition: 'background 0.15s', cursor: 'pointer', background: 'none', border: 'none', fontFamily: "'Nunito', sans-serif', textDecoration: 'none" },
  dropDivider: { height: 1, background: '#f1f5f9', margin: '4px 0' },
  loginBtn: { background: 'transparent', color: '#1a56db', border: '2px solid #1a56db', padding: '7px 18px', borderRadius: 10, fontWeight: 700, fontSize: 14, fontFamily: "'Nunito', sans-serif", cursor: 'pointer', transition: 'all 0.2s' },
  registerBtn: { background: '#1a56db', color: 'white', border: '2px solid #1a56db', padding: '7px 18px', borderRadius: 10, fontWeight: 700, fontSize: 14, fontFamily: "'Nunito', sans-serif", cursor: 'pointer', transition: 'all 0.2s' },
  hamburger: { display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#1a56db' },
};

export default Navbar;
