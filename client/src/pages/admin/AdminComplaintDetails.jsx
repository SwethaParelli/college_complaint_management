import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/common/Timeline';
import AddResponseSection from '../../components/complaints/AddResponseSection';
import AssignStaffModal from '../../components/complaints/AssignStaffModal';
import ChangeStatusModal from '../../components/complaints/ChangeStatusModal';
import Modal from '../../components/common/Modal';
import { formatDateTime } from '../../utils/formatters';
import {
  ArrowLeft,
  UserCheck,
  RotateCw,
  Trash2,
  FileText,
  Download,
  Eye,
  Star,
  User,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Lock,
  AlertTriangle,
} from 'lucide-react';

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchComplaint = useCallback(async () => {
    try {
      setLoading(true);
      const res = await complaintService.getComplaintById(id);
      if (res.success) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      toast.error('Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await complaintService.deleteComplaint(complaint._id);
      if (res.success) {
        toast.success(`Complaint ${complaint.complaintId} deleted.`);
        navigate('/admin/complaints');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete complaint.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
        Loading grievance details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Complaint Not Found</h3>
        <Link to="/admin/complaints" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Complaints</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '1100px' }}>
      {/* Top Breadcrumb & Action Bar */}
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
        <button
          onClick={() => navigate('/admin/complaints')}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to Complaints</span>
        </button>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAssignOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            <UserCheck size={15} />
            <span>Assign Staff</span>
          </button>
          <button
            onClick={() => setIsStatusOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <RotateCw size={15} />
            <span>Update Status</span>
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="code-id" style={{ fontSize: '1rem', padding: '0.35rem 0.75rem' }}>
              {complaint.complaintId}
            </span>
            <span
              className="badge"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
              }}
            >
              {complaint.category}
            </span>
            {complaint.anonymous && (
              <span
                className="badge"
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <Lock size={12} />
                <span>Anonymous (Visible to Admin Only)</span>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
          {complaint.title}
        </h2>

        <p
          style={{
            fontSize: '0.975rem',
            color: 'var(--text-muted)',
            lineHeight: '1.65',
            whiteSpace: 'pre-wrap',
            marginBottom: '1.75rem',
          }}
        >
          {complaint.description}
        </p>

        {/* Info Grid (Student, Location, Assigned Staff) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            padding: '1.25rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* Student Profile Card */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
              👤 STUDENT DETAILS
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)' }}>
              {complaint.student?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Roll No: {complaint.student?.studentId || 'N/A'} • {complaint.student?.department} ({complaint.student?.year})
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              ✉️ {complaint.student?.email} • 📞 {complaint.student?.phone || 'No phone'}
            </div>
          </div>

          {/* Assigned Staff */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
              👨‍🏫 ASSIGNED STAFF MEMBER
            </div>
            {complaint.assignedStaff ? (
              <>
                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {complaint.assignedStaff.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {complaint.assignedStaff.department}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  ✉️ {complaint.assignedStaff.email}
                </div>
              </>
            ) : (
              <div style={{ color: '#fb923c', fontStyle: 'italic', fontSize: '0.9rem' }}>
                Not yet assigned to faculty/staff.
              </div>
            )}
          </div>

          {/* Location & Dates */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
              📍 LOCATION & DATES
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {complaint.location}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Submitted: {formatDateTime(complaint.createdAt)}
            </div>
            {complaint.resolvedAt && (
              <div style={{ fontSize: '0.8rem', color: '#34d399' }}>
                Resolved: {formatDateTime(complaint.resolvedAt)}
              </div>
            )}
          </div>
        </div>

        {/* Evidence Photos */}
        {complaint.evidence && complaint.evidence.length > 0 && (
          <div style={{ marginTop: '1.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Attached Evidence ({complaint.evidence.length})
            </h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {complaint.evidence.map((filePath, idx) => {
                const isPdf = filePath.toLowerCase().endsWith('.pdf');
                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.03)',
                    }}
                  >
                    {isPdf ? (
                      <a
                        href={filePath}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '1rem 1.25rem',
                          color: 'var(--primary-400)',
                        }}
                      >
                        <FileText size={20} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>View PDF Document</span>
                        <Download size={14} />
                      </a>
                    ) : (
                      <div
                        onClick={() => setPreviewImage(filePath)}
                        style={{
                          width: '120px',
                          height: '100px',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={filePath}
                          alt={`Evidence ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                        >
                          <Eye size={20} color="#ffffff" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Existing Feedback Card */}
        {complaint.feedback && (
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1.25rem',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontWeight: '700', color: '#f59e0b', fontSize: '0.9rem' }}>
                Student Resolution Rating & Feedback
              </span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={15}
                    color={s <= complaint.feedback.rating ? '#f59e0b' : 'var(--text-dim)'}
                    fill={s <= complaint.feedback.rating ? '#f59e0b' : 'transparent'}
                  />
                ))}
              </div>
            </div>
            {complaint.feedback.comment && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                "{complaint.feedback.comment}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Visual Timeline Section */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Grievance Lifecycle Timeline
        </h3>
        <Timeline
          timeline={complaint.timeline || []}
          currentStatus={complaint.status}
        />
      </div>

      {/* Official Response & Notes Thread */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <AddResponseSection
          complaintId={complaint._id}
          responses={complaint.responses || []}
          onResponseAdded={() => fetchComplaint()}
        />
      </div>

      {/* Assign Modal */}
      <AssignStaffModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        complaint={complaint}
        onAssigned={() => fetchComplaint()}
      />

      {/* Status Modal */}
      <ChangeStatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        complaint={complaint}
        onStatusUpdated={() => fetchComplaint()}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <Modal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Confirm Ticket Deletion"
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Delete Complaint {complaint.complaintId}?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete this complaint? This will remove all associated responses and timeline records.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsDeleteOpen(false)}
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
                {deleting ? 'Deleting...' : 'Yes, Delete Ticket'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Evidence Image Preview Modal */}
      {previewImage && (
        <Modal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          title="Evidence Attachment Preview"
          maxWidth="720px"
        >
          <div style={{ textAlign: 'center' }}>
            <img
              src={previewImage}
              alt="Evidence Attachment"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminComplaintDetails;
