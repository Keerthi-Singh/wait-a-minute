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
      // If email is not verified, send user to verification page
      const current = auth.currentUser;
      if (current && current.email && current.emailVerified === false) {
        navigate('/auth/verify');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };


  return (
    <div className="resume-form-page">
      <div className="form-container glass-card" style={{ maxWidth: 480, margin: '2rem auto' }}>
        <h2>Sign in</h2>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <form onSubmit={handleEmailLogin}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={{ marginTop: 8 }}>
            <Link to="/auth/forgot">Forgot password?</Link>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="cta-button">Sign in</button>
          </div>
        </form>
        <p style={{ marginTop: 12 }}>Don't have an account? <Link to="/auth/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
