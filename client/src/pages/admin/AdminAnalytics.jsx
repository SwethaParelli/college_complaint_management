import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import StatusBarChart from '../../components/charts/StatusBarChart';
import MonthlyLineChart from '../../components/charts/MonthlyLineChart';
import PriorityBarChart from '../../components/charts/PriorityBarChart';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const AdminAnalytics = () => {
  const toast = useToast();

  const [charts, setCharts] = useState({
    categoryChartData: [],
    statusChartData: [],
    priorityChartData: [],
    monthlyData: [],
  });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getAdminDashboard();
        if (res.success) {
          setCharts(res.charts);
          setStats(res.stats);
        }
      } catch (err) {
        toast.error('Failed to load analytics datasets.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [toast]);

  // Export CSV Report
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const res = await complaintService.getComplaints({ limit: 1000 });
      if (res.success && res.complaints.length > 0) {
        const headers = [
          'Complaint ID',
          'Title',
          'Category',
          'Location',
          'Priority',
          'Status',
          'Student Name',
          'Student Department',
          'Assigned Staff',
          'Created Date',
        ];

        const rows = res.complaints.map((c) => [
          `"${c.complaintId}"`,
          `"${c.title.replace(/"/g, '""')}"`,
          `"${c.category}"`,
          `"${c.location}"`,
          `"${c.priority}"`,
          `"${c.status}"`,
          `"${c.anonymous ? 'Anonymous' : c.student?.name || 'N/A'}"`,
          `"${c.student?.department || 'N/A'}"`,
          `"${c.assignedStaff?.name || 'Unassigned'}"`,
          `"${new Date(c.createdAt).toLocaleDateString()}"`,
        ]);

        const csvContent =
          'data:text/csv;charset=utf-8,' +
          [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute(
          'download',
          `college_complaint_report_${new Date().toISOString().slice(0, 10)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('CSV Report downloaded successfully!');
      } else {
        toast.warning('No complaint records found to export.');
      }
    } catch (err) {
      toast.error('Failed to export CSV report.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
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
            Grievance Analytics & Institutional Reports
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            In-depth statistical insights and performance metrics across departments
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn btn-primary"
          disabled={exporting}
        >
          <FileSpreadsheet size={16} />
          <span>{exporting ? 'Generating CSV...' : 'Export Complaints (CSV)'}</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={18} color="#818cf8" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resolution Rate</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {stats.totalComplaints > 0
              ? `${Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%`
              : '0%'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <Clock size={18} color="#facc15" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Queued</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#facc15' }}>
            {(stats.pendingComplaints || 0) +
              (stats.underReviewComplaints || 0) +
              (stats.inProgressComplaints || 0)}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <Award size={18} color="#34d399" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Rating</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#34d399' }}>
            {stats.averageRating || 0} / 5.0
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={18} color="#38bdf8" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Students</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#38bdf8' }}>
            {stats.totalStudents || 0}
          </div>
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Breakdown by Category
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Categorical complaint distribution
          </p>
          <CategoryPieChart data={charts.categoryChartData} />
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Pipeline Status Distribution
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Count of tickets per resolution stage
          </p>
          <StatusBarChart data={charts.statusChartData} />
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Monthly Inflow vs Resolution Trend
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Monthly resolution capacity over time
          </p>
          <MonthlyLineChart data={charts.monthlyData} />
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Severity & Priority Distribution
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Critical vs High vs Medium vs Low
          </p>
          <PriorityBarChart data={charts.priorityChartData} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
