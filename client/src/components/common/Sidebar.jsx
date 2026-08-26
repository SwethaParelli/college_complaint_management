import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  Users,
  Briefcase,
  Layers,
  Star,
  BarChart3,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Submit Complaint', path: '/student/submit', icon: <PlusCircle size={18} /> },
    { name: 'My Complaints', path: '/student/complaints', icon: <FileText size={18} /> },
    { name: 'My Profile', path: '/student/profile', icon: <User size={18} /> },
  ];

  const staffLinks = [
    { name: 'Staff Dashboard', path: '/staff/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Assigned Complaints', path: '/staff/complaints', icon: <FileText size={18} /> },
    { name: 'Profile Settings', path: '/staff/profile', icon: <User size={18} /> },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'All Complaints', path: '/admin/complaints', icon: <FileText size={18} /> },
    { name: 'Students Directory', path: '/admin/students', icon: <Users size={18} /> },
    { name: 'Faculty & Staff', path: '/admin/staff', icon: <Briefcase size={18} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={18} /> },
    { name: 'Student Feedback', path: '/admin/feedback', icon: <Star size={18} /> },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
    { name: 'Admin Profile', path: '/admin/profile', icon: <User size={18} /> },
  ];

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'staff'
      ? staffLinks
      : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 199,
          }}
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          minWidth: '260px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 200,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          ...(window.innerWidth <= 992
            ? {
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
              }
            : {}),
        }}
      >
        {/* Sidebar Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(79, 70, 229, 0.4)',
              }}
            >
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                College<span style={{ color: 'var(--primary-400)' }}>Resolve</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {user?.role?.toUpperCase()} PORTAL
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon btn-sm"
            style={{ display: window.innerWidth <= 992 ? 'flex' : 'none' }}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            padding: '1.25rem 0.85rem',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth <= 992) onClose();
              }}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.3) 0%, rgba(99, 102, 241, 0.1) 100%)'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(99, 102, 241, 0.4)'
                  : '1px solid transparent',
                transition: 'var(--transition)',
              })}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div
          style={{
            padding: '1.15rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name}
                </div>
                <div
                  style={{
                    fontSize: '0.725rem',
                    color: 'var(--text-dim)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
