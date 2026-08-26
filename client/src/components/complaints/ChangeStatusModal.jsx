import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, RotateCw } from 'lucide-react';

const ChangeStatusModal = ({ isOpen, onClose, complaint, onStatusUpdated }) => {
  const toast = useToast();
  const { user } = useAuth();
  const [status, setStatus] = useState('In Progress');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (complaint?.status) {
      setStatus(complaint.status);
    }
  }, [complaint]);

  const availableStatuses =
    user?.role === 'admin'
      ? [
          'Pending',
          'Under Review',
          'Assigned',
          'In Progress',
          'Resolved',
          'Rejected',
          'Reopened',
        ]
      : ['Under Review', 'In Progress', 'Resolved'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) {
      toast.warning('Please select a valid status.');
      return;
    }

    try {
      setLoading(true);
      const res = await complaintService.updateStatus(
        complaint._id,
        status,
        remark
      );
      if (res.success) {
        toast.success(`Complaint status changed to ${status}!`);
        onStatusUpdated && onStatusUpdated(res.complaint);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Complaint Status - ${complaint?.complaintId || ''}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="statusSelect">
            Select New Status <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            id="statusSelect"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            {availableStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="statusRemark">
            Status Update Remark / Action Taken <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            id="statusRemark"
            className="form-control"
            rows="3"
            placeholder="Explain the reason or corrective action taken..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            required
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
            disabled={loading || !remark.trim()}
          >
            <RotateCw size={16} />
            <span>{loading ? 'Updating...' : 'Update Status'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeStatusModal;
