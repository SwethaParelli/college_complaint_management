import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import ChangeStatusModal from '../../components/complaints/ChangeStatusModal';
import { formatDate, truncateText } from '../../utils/formatters';
import {
  Briefcase,
  Clock,
  RotateCw,
  CheckCircle2,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState({
    totalAssigned: 0,
    pendingAction: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStaffDashboard();
      if (res.success) {
        setStats(res.stats);
        setRecentComplaints(res.recentComplaints || []);
      }
    } catch (err) {
      toast.error('Failed to load staff dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openStatusModal = (comp) => {
    setSelectedComplaint(comp);
    setIsStatusModalOpen(true);
  };

  return (
    <div className="page-wrapper">
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(18, 24, 41, 0.9) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Sparkles size={18} color="#38bdf8" />
          <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '600' }}>
            Faculty & Department Staff Portal • {user?.department}
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
          Welcome back, {user?.name}!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage your assigned grievance tickets, take field actions, and update students on resolution progress.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <StatCard
          label="Total Assigned"
          value={stats.totalAssigned}
          icon={<Briefcase size={24} />}
          iconBg="rgba(99, 102, 241, 0.15)"
          iconColor="#818cf8"
        />
        <StatCard
          label="Pending Action"
          value={stats.pendingAction}
          icon={<Clock size={24} />}
          iconBg="rgba(234, 179, 8, 0.15)"
          iconColor="#facc15"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<RotateCw size={24} />}
          iconBg="rgba(249, 115, 22, 0.15)"
          iconColor="#fb923c"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          icon={<CheckCircle2 size={24} />}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#34d399"
        />
      </div>

      {/* Recent Assigned Complaints */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Recent Assigned Tasks
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Complaints requiring your department review or resolution
            </p>
          </div>

          <Link to="/staff/complaints" className="btn btn-secondary btn-sm">
            <span>View All Assigned</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            Loading assignments...
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 className="empty-state-icon" style={{ color: '#10b981' }} />
            <h3>No pending assigned tasks!</h3>
            <p style={{ fontSize: '0.9rem' }}>
              You have no active complaints in your queue.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Student</th>
                  <th>Title & Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((comp) => (
                  <tr key={comp._id}>
                    <td>
                      <span className="code-id">{comp.complaintId}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                        {comp.anonymous ? 'Anonymous Student' : comp.student?.name || 'Student'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {comp.anonymous ? 'Confidential' : comp.student?.department || 'General'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                        {truncateText(comp.title, 40)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        📍 {comp.location}
                      </div>
                    </td>
                    <td>{comp.category}</td>
                    <td>
                      <PriorityBadge priority={comp.priority} />
                    </td>
                    <td>
                      <StatusBadge status={comp.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => openStatusModal(comp)}
                          className="btn btn-secondary btn-sm"
                        >
                          <RotateCw size={13} />
                          <span>Update</span>
                        </button>
                        <Link
                          to={`/staff/complaints/${comp._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Change Status Modal */}
      {selectedComplaint && (
        <ChangeStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          complaint={selectedComplaint}
          onStatusUpdated={() => fetchDashboard()}
        />
      )}
    </div>
  );
};

export default StaffDashboard;
