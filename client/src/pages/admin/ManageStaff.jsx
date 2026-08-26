import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import { DEPARTMENTS } from '../../utils/constants';
import {
  Briefcase,
  UserPlus,
  Edit2,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  CheckCircle,
} from 'lucide-react';

const ManageStaff = () => {
  const toast = useToast();

  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [deleteStaff, setDeleteStaff] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Infrastructure & Facilities',
    phone: '',
  });

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getStaffWorkload();
      if (res.success) {
        setStaffMembers(res.staff);
      }
    } catch (err) {
      toast.error('Failed to load faculty & staff members.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      department: 'Infrastructure & Facilities',
      phone: '',
    });
    setIsAddOpen(true);
  };

  const openEditModal = (st) => {
    setEditStaff(st);
    setFormData({
      name: st.name || '',
      email: st.email || '',
      department: st.department || 'General',
      phone: st.phone || '',
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminService.createUser({
        ...formData,
        role: 'staff',
        year: 'Faculty/Staff',
      });
      if (res.success) {
        toast.success(`Staff member '${formData.name}' created successfully!`);
        setIsAddOpen(false);
        fetchStaff();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create staff account.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminService.updateUser(editStaff._id, formData);
      if (res.success) {
        toast.success('Staff record updated successfully!');
        setEditStaff(null);
        fetchStaff();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update staff member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteStaff) return;
    try {
      setDeleting(true);
      const res = await adminService.deleteUser(deleteStaff._id);
      if (res.success) {
        toast.success(res.message);
        setDeleteStaff(null);
        fetchStaff();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete staff member.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-wrapper">
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
            Faculty & Department Staff In-Charge
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage departmental staff assigned to resolve grievance tickets and monitor workloads
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Add New Staff / Faculty</span>
        </button>
      </div>

      {/* Staff Workload Cards & Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Total Faculty/Staff: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{staffMembers.length}</span> members
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            Loading faculty & staff directory...
          </div>
        ) : staffMembers.length === 0 ? (
          <div className="empty-state">
            <Briefcase className="empty-state-icon" />
            <h3>No staff members registered</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Add faculty or department in-charges to begin assigning tickets.
            </p>
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              <UserPlus size={15} />
              <span>Add Staff</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Faculty / Staff Member</th>
                  <th>Department</th>
                  <th>Active Complaints</th>
                  <th>Total Handled</th>
                  <th>Contact</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((st) => (
                  <tr key={st._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: '#ffffff',
                            fontSize: '0.9rem',
                          }}
                        >
                          {st.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                            {st.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {st.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.875rem' }}>{st.department}</span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background:
                            st.activeComplaintsCount > 3
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(59, 130, 246, 0.15)',
                          color: st.activeComplaintsCount > 3 ? '#f87171' : '#60a5fa',
                          fontWeight: '700',
                        }}
                      >
                        {st.activeComplaintsCount} Active
                      </span>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {st.totalAssignedCount} Tickets
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <div>📞 {st.phone || 'N/A'}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button
                          onClick={() => openEditModal(st)}
                          className="btn btn-secondary btn-icon btn-sm"
                          title="Edit Staff Member"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteStaff(st)}
                          className="btn btn-danger btn-icon btn-sm"
                          title="Delete Staff Member"
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
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Add New Faculty / Staff Member"
        >
          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Prof. Arvind Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Email *</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. prof.arvind@college.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Department *</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Infrastructure & Facilities">Infrastructure & Facilities</option>
                <option value="Academic & Examination">Academic & Examination</option>
                <option value="Hostel & Residential Life">Hostel & Residential Life</option>
                <option value="IT & Campus Networking">IT & Campus Networking</option>
                <option value="Canteen & Food Services">Canteen & Food Services</option>
                <option value="Transportation Dept">Transportation Dept</option>
                <option value="Library Management">Library Management</option>
                <option value="Laboratory In-Charge">Laboratory In-Charge</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Temporary Password *</label>
              <input
                type="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsAddOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <UserPlus size={16} />
                <span>{saving ? 'Creating...' : 'Add Staff Member'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Staff Modal */}
      {editStaff && (
        <Modal
          isOpen={!!editStaff}
          onClose={() => setEditStaff(null)}
          title={`Edit Staff - ${editStaff.name}`}
        >
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Infrastructure & Facilities">Infrastructure & Facilities</option>
                <option value="Academic & Examination">Academic & Examination</option>
                <option value="Hostel & Residential Life">Hostel & Residential Life</option>
                <option value="IT & Campus Networking">IT & Campus Networking</option>
                <option value="Canteen & Food Services">Canteen & Food Services</option>
                <option value="Transportation Dept">Transportation Dept</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditStaff(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Staff Modal */}
      {deleteStaff && (
        <Modal
          isOpen={!!deleteStaff}
          onClose={() => setDeleteStaff(null)}
          title="Delete Faculty / Staff Member"
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Delete {deleteStaff.name}?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to remove this staff account? Assigned complaint records will remain intact with previous resolution histories.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteStaff(null)}
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
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageStaff;
