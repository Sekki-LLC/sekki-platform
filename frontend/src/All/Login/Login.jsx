// src/All/Login/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
// --- CORRECTED IMPORT PATH ---
import { useAuth } from '../shared/auth/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [remember, setRemember]         = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user, loading }        = useAuth();
  const navigate                        = useNavigate();

  // If already logged in, redirect to Profile
  if (user) {
    // --- CORRECTED REDIRECT PATH ---
    // The main Profile is now in the Market domain
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      // Remember me functionality (optional - you can implement this in AuthContext if needed)
      if (remember) {
        localStorage.setItem('rememberMe', 'true');
      }
      // --- CORRECTED REDIRECT PATH ---
      navigate('/profile');
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="login-page-wrapper">
      {errorMessage && <div className="login-error">{errorMessage}</div>}
      <div className="login-container">
        <div className="heading">
          <h2>Login</h2>
          <p>Welcome back! Please log in to your account.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                disabled={loading}
              />{' '}
              Remember me
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>


        <p className="signup-link">
          Don't have an account?{' '}
          <Link to="/sign-up">Sign Up</Link>
        </p>
      </div>

      <div className="owl-container">
        <img
          src="https://sekki.io/wp-content/uploads/2025/02/Big-Owl.svg"
          alt="Owl illustration"
        />
      </div>
    </div>
   );
}
