import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
    const location = useLocation();
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

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
                    <svg className="nav-logo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                        <rect x="3" y="3" width="18" height="18" />
                        <path d="M12 8v8M8 12h8" />
                    </svg>
                    Wait a Minute
                </Link>
            </div>

            <div className="nav-center">
                {role === 'admin' ? (
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
                ) : (
                    <>
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/analyzer"
                            className={`nav-link ${location.pathname === '/analyzer' ? 'active' : ''}`}
                        >
                            Basic Analyzer
                        </Link>
                        <Link
                            to="/intelligence-lab"
                            className={`nav-link ${location.pathname.startsWith('/intelligence-') ? 'active' : ''}`}
                        >
                            Intelligence Lab
                        </Link>
                        <Link
                            to="/readiness-check"
                            className={`nav-link ${location.pathname.startsWith('/readiness-') ? 'active' : ''}`}
                        >
                            Readiness Check
                        </Link>
                        <Link
                            to="/ai-threat-index"
                            className={`nav-link ${location.pathname === '/ai-threat-index' ? 'active' : ''}`}
                        >
                            Will AI Take Your Job?
                        </Link>
                        <Link
                            to="/resume/form"
                            className={`nav-link resume-btn ${location.pathname.startsWith('/resume') ? 'active' : ''}`}
                        >
                            Resume Builder
                        </Link>
                    </>
                )}
            </div>

            <div className="nav-right">
                {user ? (
                    <div className="nav-account">
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
