import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

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
            </div>
        </nav>
    );
};

export default Navbar;
