import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Pagination from '../../components/common/Pagination';
import FeedbackModal from '../../components/complaints/FeedbackModal';
import { COMPLAINT_STATUSES, COMPLAINT_PRIORITIES } from '../../utils/constants';
import { formatDate, truncateText } from '../../utils/formatters';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Star,
  RotateCcw,
  FileText,
} from 'lucide-react';

const MyComplaints = () => {
  const toast = useToast();

  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Feedback modal
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 8,
        search,
        status: status !== 'All' ? status : undefined,
        category: category !== 'All' ? category : undefined,
        priority: priority !== 'All' ? priority : undefined,
        sortBy,
        sortOrder,
      };

      const res = await complaintService.getComplaints(params);
      if (res.success) {
        setComplaints(res.complaints);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, status, category, priority, sortBy, sortOrder, toast]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchComplaints();
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('All');
    setCategory('All');
    setPriority('All');
    setCurrentPage(1);
  };

  const openFeedback = (comp) => {
    setFeedbackComplaint(comp);
    setIsFeedbackOpen(true);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
            My Complaints
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Browse, search, and track all complaints registered by your account
          </p>
        </div>

        <Link to="/student/submit" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Submit New Complaint</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
        }}
      >
        <form onSubmit={handleSearchSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end',
            }}
          >
            {/* Search Input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Search</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ID, Title, Location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.2rem' }}
                />
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                  }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Statuses</option>
                {COMPLAINT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Priorities</option>
                {COMPLAINT_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Search size={15} />
                <span>Filter</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetFilters}
                title="Reset Filters"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Complaints Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Showing <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{complaints.length}</span> of{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{total}</span> complaints
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <FileText className="empty-state-icon" />
            <h3>No complaints found</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Try clearing your active filters or submit a new grievance.
            </p>
            <button onClick={resetFilters} className="btn btn-secondary btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title & Location</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((comp) => (
                  <tr key={comp._id}>
                    <td>
                      <span className="code-id">{comp.complaintId}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                        {comp.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        📍 {comp.location}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{comp.category}</span>
                    </td>
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
                      {comp.assignedStaff?.name || (
                        <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                          Awaiting Assignment
                        </span>
                      )}
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
                          >
                            <Star size={13} fill="#f59e0b" />
                            <span>Rate</span>
                          </button>
                        )}
                        <Link
                          to={`/student/track/${comp._id}`}
                          className="btn btn-primary btn-sm"
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>

      {/* Feedback Modal */}
      {feedbackComplaint && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          complaint={feedbackComplaint}
          onFeedbackSubmitted={() => fetchComplaints()}
        />
      )}
    </div>
  );
};

export default MyComplaints;
