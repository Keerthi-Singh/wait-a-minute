import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './HistorySidebar.css';
import { useAuth } from '../contexts/AuthContext';
import { listenToAnalyses, deleteAnalysisForUser, renameAnalysisForUser } from '../firebase/firebase';

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

const IconIntelligence = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconReadiness = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconAIThreat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState('');
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
    // Prevent overriding if we are currently editing
    if (renamingId === item.id) return;
    setSelected(item.id);
    const payload = item.result || item;

    if (item.type === 'intelligence_lab') {
      localStorage.setItem('intelligenceResult', JSON.stringify(payload));
      navigate('/intelligence-result');
    } else if (item.type === 'readiness_check') {
      localStorage.setItem('readinessResult', JSON.stringify(payload));
      navigate('/readiness-result');
    } else {
      localStorage.setItem('careerResult', JSON.stringify(payload));
      navigate('/result');
    }

    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const handleEditClick = (e, item) => {
    e.stopPropagation();
    setRenamingId(item.id);
    setRenameText(item.name || (item.result && item.result.career) || 'Untitled Analysis');
  };

  const handleRenameSave = async (e, item) => {
    e.stopPropagation();
    if (!renameText.trim()) return;
    try {
      await renameAnalysisForUser(user.uid, item.id, renameText.trim());
      setRenamingId(null);
    } catch (err) {
      console.warn("Rename failed", err);
    }
  };

  const handleRenameKeyDown = (e, item) => {
    if (e.key === 'Enter') handleRenameSave(e, item);
    if (e.key === 'Escape') setRenamingId(null);
  };

  const handleDeleteClick = async (e, item) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await deleteAnalysisForUser(user.uid, item.id);
        if (selected === item.id) setSelected(null);
      } catch (err) {
        console.warn("Delete failed", err);
      }
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar-panel ${isOpen ? 'sidebar-open' : ''}`}>
        {/* ── Top: Logo + Close ── */}
        <div className="sidebar-top">
          <Link to="/" className="sidebar-logo" onClick={handleNavClick}>
            <svg className="sidebar-logo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <rect x="3" y="3" width="18" height="18" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Wait a Minute
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
            Basic Analyzer
          </Link>
          <Link
            to="/intelligence-lab"
            className={`sidebar-nav-link ${location.pathname.startsWith('/intelligence-') ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="sidebar-nav-icon"><IconIntelligence /></span>
            Intelligence Lab
          </Link>
          <Link
            to="/readiness-check"
            className={`sidebar-nav-link ${location.pathname.startsWith('/readiness-') ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="sidebar-nav-icon"><IconReadiness /></span>
            Readiness Check
          </Link>
          <Link
            to="/ai-threat-index"
            className={`sidebar-nav-link ${location.pathname === '/ai-threat-index' ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="sidebar-nav-icon"><IconAIThreat /></span>
            Will AI Take Your Job?
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
            <div
              key={item.id}
              className={`sidebar-history-item ${selected === item.id ? 'selected' : ''}`}
            >
              <div className="sidebar-history-content" onClick={() => handleClick(item)}>
                {renamingId === item.id ? (
                  <input
                    type="text"
                    className="sidebar-history-rename-input"
                    value={renameText}
                    onChange={(e) => setRenameText(e.target.value)}
                    onKeyDown={(e) => handleRenameKeyDown(e, item)}
                    onBlur={(e) => handleRenameSave(e, item)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="sidebar-history-title">
                    {item.name || (item.result && item.result.career) || 'Untitled Analysis'}
                  </div>
                )}
                <div className="sidebar-history-date">
                  {item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleDateString() : ''}
                  {item.result && (item.result.primaryCareer || item.result.topCareer) && (
                    <span className="sidebar-history-tag">
                      {' · '}
                      {(item.result.primaryCareer || item.result.topCareer).domain}
                    </span>
                  )}
                </div>
              </div>
              <div className="sidebar-history-actions">
                <button className="icon-btn edit-btn" title="Rename" onClick={(e) => handleEditClick(e, item)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="icon-btn delete-btn" title="Delete" onClick={(e) => handleDeleteClick(e, item)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            </div>
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
