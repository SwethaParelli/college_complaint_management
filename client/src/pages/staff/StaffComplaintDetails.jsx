import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/common/Timeline';
import AddResponseSection from '../../components/complaints/AddResponseSection';
import ChangeStatusModal from '../../components/complaints/ChangeStatusModal';
import Modal from '../../components/common/Modal';
import { formatDateTime } from '../../utils/formatters';
import {
  ArrowLeft,
  RotateCw,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Lock,
  User,
} from 'lucide-react';

const StaffComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status modal
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchComplaint = useCallback(async () => {
    try {
      setLoading(true);
      const res = await complaintService.getComplaintById(id);
      if (res.success) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      toast.error('Failed to load assigned complaint details.');
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
        Loading assignment details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Complaint Not Found</h3>
        <Link to="/staff/complaints" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Assigned List</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '1100px' }}>
      {/* Action Header */}
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
          onClick={() => navigate('/staff/complaints')}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to Assigned Queue</span>
        </button>

        <button
          onClick={() => setIsStatusOpen(true)}
          className="btn btn-primary"
        >
          <RotateCw size={16} />
          <span>Update Status / Mark Resolved</span>
        </button>
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
                <span>Anonymous Student</span>
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

        {/* Metadata Grid */}
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
              👤 SUBMITTED BY
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {complaint.anonymous ? 'Anonymous Student' : complaint.student?.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {complaint.anonymous ? 'Confidential' : `${complaint.student?.department} (${complaint.student?.studentId})`}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
              📍 LOCATION
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {complaint.location}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
              📅 SUBMITTED DATE
            </div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {formatDateTime(complaint.createdAt)}
            </div>
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
      </div>

      {/* Timeline Tracking */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Complaint Resolution Timeline
        </h3>
        <Timeline
          timeline={complaint.timeline || []}
          currentStatus={complaint.status}
        />
      </div>

      {/* Official Response Thread */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <AddResponseSection
          complaintId={complaint._id}
          responses={complaint.responses || []}
          onResponseAdded={() => fetchComplaint()}
        />
      </div>

      {/* Status Modal */}
      <ChangeStatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        complaint={complaint}
        onStatusUpdated={() => fetchComplaint()}
      />

      {/* Evidence Preview Modal */}
      {previewImage && (
        <Modal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          title="Attached Evidence Preview"
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

export default StaffComplaintDetails;
