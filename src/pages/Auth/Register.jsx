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
      <div className="form-container glass-card" style={{ maxWidth: 480, margin: '2rem auto' }}>
        <h2>Create account</h2>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="cta-button">Register</button>
          </div>
        </form>
        <p style={{ marginTop: 12 }}>Already have an account? <Link to="/auth/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;
