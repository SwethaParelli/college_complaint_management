import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import StatusBarChart from '../../components/charts/StatusBarChart';
import MonthlyLineChart from '../../components/charts/MonthlyLineChart';
import PriorityBarChart from '../../components/charts/PriorityBarChart';
import { formatDate, truncateText } from '../../utils/formatters';
import {
  FileText,
  Clock,
  RotateCw,
  CheckCircle2,
  XCircle,
  Users,
  Briefcase,
  Star,
  ArrowRight,
  Eye,
  Shield,
  BarChart3,
} from 'lucide-react';

const AdminDashboard = () => {
  const toast = useToast();

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    underReviewComplaints: 0,
    assignedComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    rejectedComplaints: 0,
    reopenedComplaints: 0,
    totalStudents: 0,
    totalStaff: 0,
    averageRating: 0,
    totalFeedbacks: 0,
  });

  const [charts, setCharts] = useState({
    categoryChartData: [],
    statusChartData: [],
    priorityChartData: [],
    monthlyData: [],
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getAdminDashboard();
      if (res.success) {
        setStats(res.stats);
        setCharts(res.charts);
        setRecentComplaints(res.recentComplaints || []);
        setRecentFeedback(res.recentFeedback || []);
      }
    } catch (err) {
      toast.error('Failed to load admin dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="page-wrapper">
      {/* Header Overview */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
            College Administration Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Campus-wide grievance analytics, resolution SLA monitoring, and user management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/analytics" className="btn btn-secondary btn-sm">
            <BarChart3 size={15} />
            <span>Full Analytics Report</span>
          </Link>
          <Link to="/admin/complaints" className="btn btn-primary btn-sm">
            <FileText size={15} />
            <span>Manage All Complaints</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Primary Metric Cards */}
      <div className="stats-grid">
        <StatCard
          label="Total Complaints"
          value={stats.totalComplaints}
          icon={<FileText size={24} />}
          iconBg="rgba(99, 102, 241, 0.15)"
          iconColor="#818cf8"
          subtitle="All-time registered"
        />
        <StatCard
          label="Active / In Progress"
          value={stats.pendingComplaints + stats.underReviewComplaints + stats.assignedComplaints + stats.inProgressComplaints}
          icon={<RotateCw size={24} />}
          iconBg="rgba(249, 115, 22, 0.15)"
          iconColor="#fb923c"
          subtitle="Awaiting resolution"
        />
        <StatCard
          label="Resolved Tickets"
          value={stats.resolvedComplaints}
          icon={<CheckCircle2 size={24} />}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#34d399"
          subtitle="Successfully closed"
        />
        <StatCard
          label="Satisfaction Rating"
          value={`${stats.averageRating} ⭐`}
          icon={<Star size={24} />}
          iconBg="rgba(245, 158, 11, 0.15)"
          iconColor="#f59e0b"
          subtitle={`From ${stats.totalFeedbacks} reviews`}
        />
      </div>

      {/* Secondary User Counts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.65rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: 'var(--radius-md)', color: '#60a5fa' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TOTAL ENROLLED STUDENTS</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.totalStudents}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.65rem', background: 'rgba(139, 92, 246, 0.15)', borderRadius: 'var(--radius-md)', color: '#c084fc' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>FACULTY & STAFF IN-CHARGE</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.totalStaff}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.65rem', background: 'rgba(234, 179, 8, 0.15)', borderRadius: 'var(--radius-md)', color: '#facc15' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>PENDING & UNDER REVIEW</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {stats.pendingComplaints + stats.underReviewComplaints}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.65rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-md)', color: '#f87171' }}>
            <XCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>REJECTED COMPLAINTS</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.rejectedComplaints}</div>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Complaints by Category (Pie) */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Complaints by Category
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Distribution across college departments and facilities
          </p>
          <CategoryPieChart data={charts.categoryChartData} />
        </div>

        {/* Complaints by Status (Bar) */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Complaints by Status
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Current pipeline resolution stages
          </p>
          <StatusBarChart data={charts.statusChartData} />
        </div>

        {/* Monthly Complaint Trends (Line/Area) */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Monthly Grievance & Resolution Trends
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Received vs. successfully resolved tickets over past 6 months
          </p>
          <MonthlyLineChart data={charts.monthlyData} />
        </div>

        {/* Priority Distribution */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Priority Level Distribution
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Critical vs High vs Medium vs Low severity grievances
          </p>
          <PriorityBarChart data={charts.priorityChartData} />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Recent Complaints
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Latest grievance tickets submitted across all departments
            </p>
          </div>

          <Link to="/admin/complaints" className="btn btn-secondary btn-sm">
            <span>View All ({stats.totalComplaints})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

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
                      {comp.student?.name || 'Student'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {comp.student?.studentId || 'ID'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                      {truncateText(comp.title, 35)}
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
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {comp.assignedStaff?.name || (
                      <span style={{ color: '#fb923c', fontStyle: 'italic' }}>
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/admin/complaints/${comp._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Eye size={14} />
                      <span>Manage</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
