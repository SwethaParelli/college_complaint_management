import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import { DEPARTMENTS, ACADEMIC_YEARS } from '../../utils/constants';
import { User, Lock, Save, ShieldCheck, Mail, Phone, BookOpen, Key } from 'lucide-react';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || 'General',
    year: user?.year || '1st Year',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handleProfileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await authService.updateProfile(formData);
      if (res.success) {
        toast.success('Profile updated successfully!');
        updateUser(res.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters.');
      return;
    }

    try {
      setChangingPass(true);
      const res = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
          Student Profile & Security
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage your personal university profile and authentication settings
        </p>
      </div>

      {/* Profile Overview Card */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#ffffff',
            boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)',
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>{user?.name}</h3>
            <span
              className="badge"
              style={{
                background: 'rgba(79, 70, 229, 0.15)',
                color: 'var(--primary-400)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              {user?.role?.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Student ID: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{user?.studentId || 'N/A'}</span> • {user?.department} ({user?.year})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            {user?.email}
          </div>
        </div>
      </div>

      {/* Edit Profile Details */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          Personal Details
        </h3>

        <form onSubmit={handleProfileSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="profName">
                Full Name
              </label>
              <input
                id="profName"
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profEmail">
                Email Address (Read-only)
              </label>
              <input
                id="profEmail"
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="profDept">
                Department
              </label>
              <select
                id="profDept"
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleProfileChange}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profYear">
                Academic Year
              </label>
              <select
                id="profYear"
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleProfileChange}
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profPhone">
              Phone Number
            </label>
            <input
              id="profPhone"
              name="phone"
              type="tel"
              className="form-control"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleProfileChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={savingProfile}
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={16} />
            <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          Change Password
        </h3>

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="currPass">
              Current Password
            </label>
            <input
              id="currPass"
              name="currentPassword"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="newPass">
                New Password (min 6 characters)
              </label>
              <input
                id="newPass"
                name="newPassword"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPass">
                Confirm New Password
              </label>
              <input
                id="confirmPass"
                name="confirmNewPassword"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={changingPass}
            style={{ marginTop: '0.5rem' }}
          >
            <Key size={16} />
            <span>{changingPass ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
