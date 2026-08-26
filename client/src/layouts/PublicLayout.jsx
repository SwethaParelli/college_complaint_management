import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { ShieldCheck, Heart } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-sidebar)',
          padding: '2.5rem 0 1.5rem 0',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={18} color="#ffffff" />
              </div>
              <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                CollegeResolve CMS
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }}>
                Home
              </Link>
              <Link to="/login" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }}>
                Login Portal
              </Link>
              <Link to="/register" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }}>
                Student Registration
              </Link>
            </div>
          </div>

          <div
            style={{
              paddingTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.8rem',
              color: 'var(--text-dim)',
            }}
          >
            <div>© {new Date().getFullYear()} College Complaint Management System. All rights reserved.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Built with precision for transparent campus governance
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
