import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import FeedbackModal from '../../components/complaints/FeedbackModal';
import { formatDate, truncateText } from '../../utils/formatters';
import {
  FileText,
  Clock,
  RotateCw,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  Eye,
  Star,
  Sparkles,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    rejectedComplaints: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback modal state
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStudentDashboard();
      if (res.success) {
        setStats(res.stats);
        setRecentComplaints(res.recentComplaints || []);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openFeedback = (comp) => {
    setFeedbackComplaint(comp);
    setIsFeedbackOpen(true);
  };

  return (
    <div className="page-wrapper">
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(18, 24, 41, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Sparkles size={18} color="#818cf8" />
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-400)', fontWeight: '600' }}>
              Student Portal • {user?.department || 'Engineering'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Welcome back, {user?.name}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Track your submitted grievances, receive real-time department updates, and provide resolution feedback.
          </p>
        </div>

        <Link to="/student/submit" className="btn btn-primary btn-lg">
          <PlusCircle size={18} />
          <span>Submit New Complaint</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Submitted"
          value={stats.totalComplaints}
          icon={<FileText size={24} />}
          iconBg="rgba(99, 102, 241, 0.15)"
          iconColor="#818cf8"
        />
        <StatCard
          label="Pending / Review"
          value={stats.pendingComplaints}
          icon={<Clock size={24} />}
          iconBg="rgba(234, 179, 8, 0.15)"
          iconColor="#facc15"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgressComplaints}
          icon={<RotateCw size={24} />}
          iconBg="rgba(249, 115, 22, 0.15)"
          iconColor="#fb923c"
        />
        <StatCard
          label="Resolved"
          value={stats.resolvedComplaints}
          icon={<CheckCircle2 size={24} />}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#34d399"
        />
        <StatCard
          label="Rejected"
          value={stats.rejectedComplaints}
          icon={<XCircle size={24} />}
          iconBg="rgba(239, 68, 68, 0.15)"
          iconColor="#f87171"
        />
      </div>

      {/* Recent Complaints Section */}
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
              Recent Complaints
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Your latest submitted grievance records and status updates
            </p>
          </div>

          <Link to="/student/complaints" className="btn btn-secondary btn-sm">
            <span>View All My Complaints</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            Loading complaints...
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="empty-state">
            <FileText className="empty-state-icon" />
            <h3>No complaints filed yet</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Have an issue with lab equipment, hostel facilities, or campus Wi-Fi?
            </p>
            <Link to="/student/submit" className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              <span>Submit First Complaint</span>
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
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
                        {truncateText(comp.title, 40)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {comp.location}
                      </div>
                    </td>
                    <td>{comp.category}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {formatDate(comp.createdAt)}
                    </td>
                    <td>
                      <PriorityBadge priority={comp.priority} />
                    </td>
                    <td>
                      <StatusBadge status={comp.status} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {comp.assignedStaff?.name || 'Unassigned'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        {comp.status === 'Resolved' && !comp.feedback && (
                          <button
                            onClick={() => openFeedback(comp)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              color: '#f59e0b',
                              borderColor: 'rgba(245, 158, 11, 0.4)',
                              background: 'rgba(245, 158, 11, 0.1)',
                            }}
                            title="Rate Resolution"
                          >
                            <Star size={14} fill="#f59e0b" />
                            <span>Rate</span>
                          </button>
                        )}
                        <Link
                          to={`/student/track/${comp._id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} />
                          <span>Track</span>
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

      {/* Feedback Modal */}
      {feedbackComplaint && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          complaint={feedbackComplaint}
          onFeedbackSubmitted={() => fetchDashboard()}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
