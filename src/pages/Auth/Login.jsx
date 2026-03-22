import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import '../../components/Loader.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };


  return (
    <div className="resume-form-page">
      <div className="form-container glass-card" style={{ maxWidth: 420, margin: '4rem auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Wait a <span style={{ color: 'var(--bg-sage)' }}>Minute</span>
            </div>
          </Link>
        </div>

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Welcome Back</h2>
        {error && <div style={{ color: 'crimson', marginBottom: '1rem', background: 'rgba(220, 20, 60, 0.1)', padding: '0.8rem', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleEmailLogin} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <Link to="/auth/forgot" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Forgot password?</Link>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </button>
          </div>
        </form>
        <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Don't have an account? <Link to="/auth/register" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Create one</Link></p>
      </div>
    </div>
  );
};

export default Login;
