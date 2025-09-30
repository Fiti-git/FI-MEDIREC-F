import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Placeholder (not used in API)
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'http://206.189.156.71:5000/api/accounts'; // Change this to your Django backend URL

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the JWT token if needed
        localStorage.setItem('accessToken', data.access);
        navigate('/'); // Redirect to Home
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        navigate('/'); // Redirect after successful registration
      } else {
        const errorData = await response.json();
        const messages = Object.values(errorData).flat().join(' ');
        setError(messages || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-content">
          <h1 className="brand">Mylyf Reporting Platform</h1>
          <h2 className="welcome-text">
            {isRegistering ? 'Create an Account' : 'Welcome Back! Please'}<br />
            {isRegistering ? 'Register to Get Started' : 'Login to Access Medical Reports'}
          </h2>
          <p className="subtext">
            AI-powered diagnostics and reporting platform for healthcare professionals.
          </p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit} className="login-form">
            {isRegistering && (
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isRegistering && (
              <div className="input-box">
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            )}

            <button type="submit" className="login-button">{isRegistering ? 'Register' : 'Login'}</button>
          </form>

          <div className="hint">
            <span>
              {isRegistering ? 'Already have an account? ' : 'New here? '}
              <button onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }} className="toggle-button">
                {isRegistering ? 'Login' : 'Register'}
              </button>
            </span>
            <div className="arrow">↑</div>
          </div>

          <footer className="footer">
            @2025 FITI – <a href="https://fiti.solutions" target="_blank" rel="noreferrer">fiti.solutions</a>
          </footer>
        </div>
      </div>

      <div className="login-right">
        <img
          src="https://alphahmc.com/assets/img/na-troi-logo-red.svg"
          alt="Medical AI Illustration"
        />
      </div>
    </div>
  );
}

export default Login;
