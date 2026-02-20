import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Forgot = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await resetPassword(email);
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
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

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Reset Password</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Enter your email and we'll send you a link to reset your password.</p>

        {message && <div style={{ color: '#22c55e', marginBottom: '1rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.8rem', borderRadius: '8px' }}>{message}</div>}
        {error && <div style={{ color: 'crimson', marginBottom: '1rem', background: 'rgba(220, 20, 60, 0.1)', padding: '0.8rem', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Send Reset Link
            </button>
          </div>
        </form>
        <p style={{ marginTop: '2rem', color: '#94a3b8' }}>Remembered your password? <Link to="/auth/login" style={{ color: '#6366f1', fontWeight: 600 }}>Sign in</Link></p>
      </div>
    </div>
  );
};

export default Forgot;
