import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/common/Timeline';
import AddResponseSection from '../../components/complaints/AddResponseSection';
import FeedbackModal from '../../components/complaints/FeedbackModal';
import Modal from '../../components/common/Modal';
import { formatDateTime, formatDate } from '../../utils/formatters';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Shield,
  FileText,
  Star,
  RotateCcw,
  Download,
  Eye,
  Lock,
} from 'lucide-react';

const TrackComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Feedback modal
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Reopen modal
  const [isReopenOpen, setIsReopenOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopening, setReopening] = useState(false);

  // Evidence image preview modal
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

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) {
      toast.warning('Please provide a reason for reopening this complaint.');
      return;
    }

    try {
      setReopening(true);
      const res = await complaintService.reopenComplaint(complaint._id, reopenReason);
      if (res.success) {
        toast.success('Complaint reopened for further review.');
        setIsReopenOpen(false);
        setReopenReason('');
        fetchComplaint();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reopen complaint.');
    } finally {
      setReopening(false);
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
        <Link to="/student/complaints" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to My Complaints</span>
        </Link>
      </div>
    );
  }

  const isResolved = complaint.status === 'Resolved';
  const isRejected = complaint.status === 'Rejected';

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
          onClick={() => navigate('/student/complaints')}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to Complaints</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {isResolved && !complaint.feedback && (
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
            >
              <Star size={15} fill="#ffffff" />
              <span>Give Resolution Feedback</span>
            </button>
          )}

          {(isResolved || isRejected) && (
            <button
              onClick={() => setIsReopenOpen(true)}
              className="btn btn-secondary btn-sm"
            >
              <RotateCcw size={15} />
              <span>Reopen Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* Header Badges & ID */}
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
                <span>Anonymous</span>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Title & Description */}
        <h2
          style={{
            fontSize: '1.5rem',
            color: 'var(--text-main)',
            marginBottom: '1rem',
            lineHeight: '1.3',
          }}
        >
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

        {/* Metadata Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
              📍 CAMPUS LOCATION
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {complaint.location}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
              📅 SUBMITTED ON
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {formatDateTime(complaint.createdAt)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
              👨‍🏫 ASSIGNED FACULTY / STAFF
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {complaint.assignedStaff ? (
                <span>
                  {complaint.assignedStaff.name} ({complaint.assignedStaff.department})
                </span>
              ) : (
                <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  Under review for staff assignment
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Evidence / Attachments Gallery */}
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
                Your Resolution Feedback
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
          Live Complaint Progress & Timeline
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Real-time tracking of administrative review, staff delegation, and resolution actions
        </p>

        <Timeline
          timeline={complaint.timeline || []}
          currentStatus={complaint.status}
        />
      </div>

      {/* Official Response & Discussion Thread */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <AddResponseSection
          complaintId={complaint._id}
          responses={complaint.responses || []}
          onResponseAdded={() => fetchComplaint()}
        />
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        complaint={complaint}
        onFeedbackSubmitted={() => fetchComplaint()}
      />

      {/* Reopen Modal */}
      <Modal
        isOpen={isReopenOpen}
        onClose={() => setIsReopenOpen(false)}
        title={`Reopen Complaint - ${complaint.complaintId}`}
      >
        <form onSubmit={handleReopen}>
          <div className="form-group">
            <label className="form-label" htmlFor="reopenReasonInput">
              Reason for Reopening <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              id="reopenReasonInput"
              className="form-control"
              rows="4"
              placeholder="Explain why the issue requires further attention or if the previous fix failed..."
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsReopenOpen(false)}
              disabled={reopening}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={reopening}
            >
              <RotateCcw size={16} />
              <span>{reopening ? 'Reopening...' : 'Confirm Reopen'}</span>
            </button>
          </div>
        </form>
      </Modal>

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

export default TrackComplaint;
