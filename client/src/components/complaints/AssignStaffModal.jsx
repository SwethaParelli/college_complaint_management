import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { adminService } from '../../services/adminService';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import { UserCheck, Shield } from 'lucide-react';

const AssignStaffModal = ({ isOpen, onClose, complaint, onAssigned }) => {
  const toast = useToast();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingStaff, setFetchingStaff] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchStaff = async () => {
        try {
          setFetchingStaff(true);
          const res = await adminService.getStaffWorkload();
          if (res.success) {
            setStaffList(res.staff);
            if (complaint?.assignedStaff?._id) {
              setSelectedStaff(complaint.assignedStaff._id);
            } else if (res.staff.length > 0) {
              setSelectedStaff(res.staff[0]._id);
            }
          }
        } catch (err) {
          toast.error('Failed to load faculty & staff list.');
        } finally {
          setFetchingStaff(false);
        }
      };
      fetchStaff();
    }
  }, [isOpen, complaint, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaff) {
      toast.warning('Please select a staff member.');
      return;
    }

    try {
      setLoading(true);
      const res = await complaintService.assignStaff(
        complaint._id,
        selectedStaff,
        remark
      );
      if (res.success) {
        toast.success(`Complaint assigned successfully!`);
        onAssigned && onAssigned(res.complaint);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Staff Member - ${complaint?.complaintId || ''}`}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Selected Complaint</label>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
              {complaint?.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Category: {complaint?.category} • Location: {complaint?.location}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="staffSelect">
            Assign To Faculty / Staff Member <span style={{ color: '#ef4444' }}>*</span>
          </label>
          {fetchingStaff ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Loading faculty members...
            </div>
          ) : (
            <select
              id="staffSelect"
              className="form-control"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              required
            >
              <option value="">-- Choose Faculty / Department In-charge --</option>
              {staffList.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name} ({st.department}) — Active tasks: {st.activeComplaintsCount || 0}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="assignRemark">
            Assignment Remark / Instructions (Optional)
          </label>
          <textarea
            id="assignRemark"
            className="form-control"
            rows="3"
            placeholder="e.g. Please inspect the faulty lab hardware by tomorrow afternoon..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || fetchingStaff || !selectedStaff}
          >
            <UserCheck size={16} />
            <span>{loading ? 'Assigning...' : 'Confirm Assignment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignStaffModal;
