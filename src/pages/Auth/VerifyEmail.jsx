import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const VerifyEmail = () => {
  const { user, sendEmailVerificationToUser, refreshUser } = useAuth();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResend = async () => {
    setMessage(null);
    setError(null);
    try {
      await sendEmailVerificationToUser();
      setMessage('Verification email sent. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send verification email');
    }
  };

  const handleCheck = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const refreshed = await refreshUser();
      if (refreshed && refreshed.emailVerified) {
        navigate('/');
      } else {
        setMessage('Email still not verified. Try the "I verified" button after confirming the link in your inbox.');
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh user');
    }
    setLoading(false);
  };

  return (
    <div className="resume-form-page">
      <div className="form-container glass-card" style={{ maxWidth: 440, margin: '4rem auto', textAlign: 'center' }}>
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

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Verify Your Email</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We've sent a verification link to <strong style={{ color: 'var(--text-main)' }}>{user?.email || 'your email'}</strong>. Please open that link to verify your account.</p>

        {message && <div style={{ color: '#22c55e', marginBottom: '1rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.8rem', borderRadius: '8px' }}>{message}</div>}
        {error && <div style={{ color: 'crimson', marginBottom: '1rem', background: 'rgba(220, 20, 60, 0.1)', padding: '0.8rem', borderRadius: '8px' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <button className="cta-button" onClick={handleCheck} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {loading ? 'Checking Status...' : 'I Verified — Check Now'}
          </button>

          <button className="secondary-btn" onClick={handleResend} style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            Resend Verification Link
          </button>
        </div>

        <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>If the link expired, resend it. If you still have issues, contact our support team.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
