import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      <div className="form-container glass-card" style={{ maxWidth: 640, margin: '2rem auto', textAlign: 'center' }}>
        <h2>Verify your email</h2>
        <p>We've sent a verification link to <strong>{user?.email || 'your email'}</strong>. Please open that link to verify your account.</p>
        {message && <div style={{ color: 'green' }}>{message}</div>}
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          <button className="cta-button" onClick={handleResend}>Resend verification</button>
          <button className="secondary-btn" onClick={handleCheck} disabled={loading}>{loading ? 'Checking…' : 'I verified — check status'}</button>
        </div>
        <p style={{ marginTop: 12, color: '#666' }}>If the verification link expired, resend it. If you still have issues, contact support.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
