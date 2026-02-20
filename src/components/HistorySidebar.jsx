import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './HistorySidebar.css';
import { useAuth } from '../contexts/AuthContext';
import { listenToAnalyses } from '../firebase/firebase';

/* ── Inline SVG Icons (professional, no emojis) ── */
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconAnalyzer = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

const IconResume = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const HistorySidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || !user.uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = listenToAnalyses(user.uid, (list) => {
      setItems(list);
      setLoading(false);
    }, (err) => {
      setError(err.message || String(err));
      setLoading(false);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [user]);

  const handleClick = (item) => {
    setSelected(item.id);
    const payload = item.result || item;
    localStorage.setItem('careerResult', JSON.stringify(payload));
    navigate('/result');
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar-panel ${isOpen ? 'sidebar-open' : ''}`}>
        {/* ── Top: Logo + Close ── */}
        <div className="sidebar-top">
          <Link to="/" className="sidebar-logo" onClick={handleNavClick}>
            <svg className="sidebar-logo-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Wait a <span className="gradient-text">Minute</span>
          </Link>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Navigation links (visible on mobile, hidden on desktop) ── */}
        <nav className="sidebar-nav">
          <Link
            to="/"
            className={`sidebar-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="sidebar-nav-icon"><IconHome /></span>
            Home
          </Link>
          <Link
            to="/analyzer"
            className={`sidebar-nav-link ${location.pathname === '/analyzer' ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="sidebar-nav-icon"><IconAnalyzer /></span>
            Analyzer
          </Link>
          <Link
            to="/resume/form"
            className={`sidebar-nav-link ${location.pathname.startsWith('/resume') ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="sidebar-nav-icon"><IconResume /></span>
            Resume Builder
          </Link>
        </nav>

        {/* ── Divider ── */}
        <div className="sidebar-divider" />

        {/* ── History section ── */}
        <div className="sidebar-section-label">
          <IconClock />
          <span>History</span>
        </div>

        <div className="sidebar-history-list">
          {loading && <div className="sidebar-status">Loading…</div>}
          {error && <div className="sidebar-status sidebar-error">{error}</div>}
          {items.map(item => (
            <button
              key={item.id}
              className={`sidebar-history-item ${selected === item.id ? 'selected' : ''}`}
              onClick={() => handleClick(item)}
            >
              <div className="sidebar-history-title">{item.name || item.result?.career || 'Untitled Analysis'}</div>
              <div className="sidebar-history-date">
                {item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleDateString() : ''}
              </div>
            </button>
          ))}
          {!loading && items.length === 0 && (
            <div className="sidebar-status">No history yet — run the Analyzer!</div>
          )}
        </div>

        {/* ── Bottom: User info ── */}
        {user && (
          <div className="sidebar-bottom">
            <div className="sidebar-user-info">
              <div className="sidebar-user-avatar">
                {(user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="sidebar-user-email">{user.email || user.uid}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default HistorySidebar;
