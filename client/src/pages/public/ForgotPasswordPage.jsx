import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { KeyRound, ArrowLeft, Mail, ExternalLink } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Please provide your email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword(email);
      if (res.success) {
        toast.success('Password reset link generated!');
        setResetInfo(res);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'No account found with this email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        minHeight: 'calc(100vh - 180px)',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <KeyRound size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Forgot Password
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Enter your college email to recover your account
          </p>
        </div>

        {resetInfo ? (
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#34d399', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' }}>
              Reset link generated successfully!
            </p>
            <Link
              to={`/reset-password/${resetInfo.resetToken}`}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex' }}
            >
              <span>Proceed to Reset Password</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="forgotEmail">
                Registered College Email
              </label>
              <input
                id="forgotEmail"
                type="email"
                className="form-control"
                placeholder="e.g. yourname@college.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            >
              <Mail size={18} />
              <span>{loading ? 'Sending Request...' : 'Send Reset Link'}</span>
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
