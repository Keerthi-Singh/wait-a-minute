import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
    const location = useLocation();
    const { user, role, subscription, logout } = useAuth();
    const navigate = useNavigate();
    const isPro = subscription?.planId && subscription.planId !== 'free';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth/login', { replace: true });
        } catch (err) {
            console.warn('Logout failed', err);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {/* Hamburger — opens sidebar from the LEFT (ChatGPT-style) */}
                {onToggleSidebar && (
                    <button
                        className="hamburger-btn"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {sidebarOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                )}

                <Link to="/" className="nav-logo">
                    <svg className="nav-logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Wait a <span className="gradient-text">Minute</span>
                </Link>
            </div>

            <div className="nav-center">
                {role === 'admin' ? (
                    <>
                        <Link
                            to="/admin-dashboard"
                            className={`nav-link ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
                        >
                            <svg className="nav-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                            Admin Console
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/pricing"
                            className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}
                        >
                            <svg className="nav-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            Pricing
                        </Link>
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            <svg className="nav-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Home
                        </Link>
                        <Link
                            to="/analyzer"
                            className={`nav-link ${location.pathname === '/analyzer' ? 'active' : ''}`}
                        >
                            <svg className="nav-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                            </svg>
                            Basic Analyzer
                        </Link>
                        <Link
                            to="/intelligence-lab"
                            className={`nav-link ${location.pathname.startsWith('/intelligence-') ? 'active' : ''}`}
                        >
                            <svg className="nav-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                <polyline points="2 17 12 22 22 17" />
                                <polyline points="2 12 12 17 22 12" />
                            </svg>
                            Intelligence Lab
                        </Link>
                        <Link
                            to="/readiness-check"
                            className={`nav-link ${location.pathname.startsWith('/readiness-') ? 'active' : ''}`}
                        >
                            <svg className="nav-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Readiness Check
                        </Link>
                        <Link
                            to="/resume/form"
                            className={`nav-link resume-btn ${location.pathname.startsWith('/resume') ? 'active' : ''}`}
                        >
                            <svg className="nav-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            Resume Builder
                        </Link>
                    </>
                )}
            </div>

            <div className="nav-right">
                {user ? (
                    <div className="nav-account">
                        <div className={`plan-badge ${subscription?.planId}`}>
                            {isPro && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}>
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            )}
                            {subscription?.planId?.toUpperCase() || 'FREE'}
                        </div>
                        <span className="nav-user">{user.email || user.uid}</span>
                        {!user.emailVerified && (
                            <button className="secondary-btn" onClick={() => navigate('/auth/verify')}>Verify</button>
                        )}
                        <button className="secondary-btn" onClick={handleLogout}>Sign out</button>
                    </div>
                ) : (
                    <div className="nav-account">
                        <button className="secondary-btn" onClick={() => navigate('/auth/login')}>Sign in</button>
                        <button className="cta-button cta-sm" onClick={() => navigate('/auth/register')}>Sign up</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
