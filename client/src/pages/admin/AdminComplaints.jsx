import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { categoryService } from '../../services/categoryService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Pagination from '../../components/common/Pagination';
import AssignStaffModal from '../../components/complaints/AssignStaffModal';
import ChangeStatusModal from '../../components/complaints/ChangeStatusModal';
import Modal from '../../components/common/Modal';
import { COMPLAINT_STATUSES, COMPLAINT_PRIORITIES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  Filter,
  UserCheck,
  RotateCw,
  Eye,
  Trash2,
  RotateCcw,
  FileText,
  AlertTriangle,
} from 'lucide-react';

const AdminComplaints = () => {
  const toast = useToast();

  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals
  const [assignComplaint, setAssignComplaint] = useState(null);
  const [statusComplaint, setStatusComplaint] = useState(null);
  const [deleteComplaint, setDeleteComplaint] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDropdownData = async () => {
    try {
      const [catRes, staffRes] = await Promise.all([
        categoryService.getCategories(),
        adminService.getStaffWorkload(),
      ]);
      if (catRes.success) setCategories(catRes.categories);
      if (staffRes.success) setStaffMembers(staffRes.staff);
    } catch (err) {
      console.error('Error fetching dropdowns:', err);
    }
  };

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search,
        status: status !== 'All' ? status : undefined,
        category: category !== 'All' ? category : undefined,
        priority: priority !== 'All' ? priority : undefined,
        assignedStaff: assignedStaff || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
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
  }, [
    currentPage,
    search,
    status,
    category,
    priority,
    assignedStaff,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    toast,
  ]);

  useEffect(() => {
    fetchDropdownData();
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
    setAssignedStaff('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteComplaint) return;
    try {
      setDeleting(true);
      const res = await complaintService.deleteComplaint(deleteComplaint._id);
      if (res.success) {
        toast.success(`Complaint ${deleteComplaint.complaintId} deleted.`);
        setDeleteComplaint(null);
        fetchComplaints();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete complaint.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
          All Complaints Management
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Search, assign staff, modify statuses, and manage all student grievances across the institution
        </p>
      </div>

      {/* Advanced Filter Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end',
            }}
          >
            {/* Search */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Search Query</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ID, Title, Student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.2rem' }}
                />
                <Search
                  size={15}
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

            {/* Category */}
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

            {/* Status */}
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

            {/* Priority */}
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

            {/* Assigned Staff */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Assigned Staff</label>
              <select
                className="form-control"
                value={assignedStaff}
                onChange={(e) => {
                  setAssignedStaff(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Staff / Any</option>
                {staffMembers.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filters */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
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

      {/* Main Table */}
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
            <h3>No complaints match your query</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Try adjusting your search terms or filter criteria.
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
                  <th>Assigned Staff</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
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
                        {comp.student?.name || 'Student'}
                        {comp.anonymous && (
                          <span
                            style={{
                              marginLeft: '4px',
                              fontSize: '0.65rem',
                              color: '#c084fc',
                              background: 'rgba(139, 92, 246, 0.15)',
                              padding: '2px 5px',
                              borderRadius: '4px',
                            }}
                          >
                            Anon
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {comp.student?.studentId || comp.student?.department || 'General'}
                      </div>
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
                    <td>
                      <PriorityBadge priority={comp.priority} />
                    </td>
                    <td>
                      <StatusBadge status={comp.status} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {comp.assignedStaff?.name || (
                        <button
                          onClick={() => setAssignComplaint(comp)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        >
                          + Assign
                        </button>
                      )}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {formatDate(comp.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setAssignComplaint(comp)}
                          className="btn btn-secondary btn-icon btn-sm"
                          title="Assign Staff"
                        >
                          <UserCheck size={14} />
                        </button>
                        <button
                          onClick={() => setStatusComplaint(comp)}
                          className="btn btn-secondary btn-icon btn-sm"
                          title="Change Status"
                        >
                          <RotateCw size={14} />
                        </button>
                        <Link
                          to={`/admin/complaints/${comp._id}`}
                          className="btn btn-primary btn-icon btn-sm"
                          title="Full Details"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteComplaint(comp)}
                          className="btn btn-danger btn-icon btn-sm"
                          title="Delete Complaint"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>

      {/* Assign Modal */}
      {assignComplaint && (
        <AssignStaffModal
          isOpen={!!assignComplaint}
          onClose={() => setAssignComplaint(null)}
          complaint={assignComplaint}
          onAssigned={() => fetchComplaints()}
        />
      )}

      {/* Status Modal */}
      {statusComplaint && (
        <ChangeStatusModal
          isOpen={!!statusComplaint}
          onClose={() => setStatusComplaint(null)}
          complaint={statusComplaint}
          onStatusUpdated={() => fetchComplaints()}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteComplaint && (
        <Modal
          isOpen={!!deleteComplaint}
          onClose={() => setDeleteComplaint(null)}
          title="Confirm Deletion"
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Delete Complaint {deleteComplaint.complaintId}?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete this complaint ticket ("{deleteComplaint.title}")? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteComplaint(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminComplaints;
