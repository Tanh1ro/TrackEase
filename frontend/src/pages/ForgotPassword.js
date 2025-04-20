import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../css/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { colors } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement forgot password API call
      setMessage('Password reset link has been sent to your email');
    } catch (error) {
      setMessage('Error sending reset link. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container" style={{ backgroundColor: colors.background }}>
      <div className="forgot-password-box" style={{ backgroundColor: colors.cardBackground }}>
        <h2 style={{ color: colors.text }}>Forgot Password</h2>
        <p style={{ color: colors.textSecondary }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border
              }}
            />
          </div>
          {message && (
            <div className="message" style={{ color: message.includes('Error') ? 'red' : 'green' }}>
              {message}
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Send Reset Link
          </button>
        </form>
        <div className="links">
          <Link to="/login" style={{ color: colors.primary }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 