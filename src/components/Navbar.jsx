import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const location = useLocation();

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.warn('Logout failed', err);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="nav-logo">
                    Career<span className="gradient-text">AI</span>
                </Link>
            </div>
            <div className="nav-links">
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
                    Analyzer
                </Link>
                <Link
                    to="/resume/form"
                    className={`nav-link resume-btn ${location.pathname.startsWith('/resume') ? 'active' : ''}`}
                >
                    Resume Builder
                </Link>

                {user ? (
                    <div className="nav-account">
                        <span className="nav-user">{user.email || user.uid}</span>
                        {!user.emailVerified && (
                            <button className="secondary-btn" onClick={() => navigate('/auth/verify')}>Verify email</button>
                        )}
                        <button className="secondary-btn" onClick={() => navigate('/resume/my')}>My Resumes</button>
                        <button className="secondary-btn" onClick={handleLogout}>Sign out</button>
                    </div>
                ) : (
                    <div className="nav-account">
                        <button className="secondary-btn" onClick={() => navigate('/auth/login')}>Sign in</button>
                        <button className="cta-button" onClick={() => navigate('/auth/register')}>Sign up</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
