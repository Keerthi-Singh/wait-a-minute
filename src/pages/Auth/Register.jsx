import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register, sendEmailVerificationToUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      // after registering, send verification and show verify page
      try {
        await sendEmailVerificationToUser();
      } catch (err) {
        // ignore send verification errors here; user can resend on verify page
        console.warn('send verification failed', err);
      }
      navigate('/auth/verify');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Wait a <span className="gradient-text">Minute</span>
            </div>
          </Link>
        </div>

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Create Account</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Join the AI-powered career platform today.</p>

        {error && <div style={{ color: 'crimson', marginBottom: '1rem', background: 'rgba(220, 20, 60, 0.1)', padding: '0.8rem', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Sign Up
            </button>
          </div>
        </form>
        <p style={{ marginTop: '2rem', color: '#94a3b8' }}>Already have an account? <Link to="/auth/login" style={{ color: '#6366f1', fontWeight: 600 }}>Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;
