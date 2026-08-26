import React from 'react';
import StatusBadge from './StatusBadge';
import { formatDateTime } from '../../utils/formatters';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const standardSteps = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
];

const Timeline = ({ timeline = [], currentStatus = 'Pending' }) => {
  // Determine progress step index
  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Under Review':
        return 1;
      case 'Assigned':
        return 2;
      case 'In Progress':
        return 3;
      case 'Resolved':
        return 4;
      case 'Rejected':
        return 1; // shows as stopped
      case 'Reopened':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveStepIndex(currentStatus);
  const isRejected = currentStatus === 'Rejected';
  const isReopened = currentStatus === 'Reopened';

  return (
    <div style={{ width: '100%' }}>
      {/* Visual Stepper Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '1.5rem 0.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {standardSteps.map((step, idx) => {
          const isCompleted = idx <= activeIndex && !isRejected;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={step}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flex: 1,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCompleted
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : isCurrent && isRejected
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'var(--bg-card-alt)',
                  border: isCompleted
                    ? '2px solid #34d399'
                    : isCurrent && isRejected
                    ? '2px solid #f87171'
                    : '2px solid var(--border-color)',
                  color: isCompleted || (isCurrent && isRejected) ? '#ffffff' : 'var(--text-dim)',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  boxShadow: isCompleted
                    ? '0 0 12px rgba(16, 185, 129, 0.4)'
                    : 'none',
                  transition: 'var(--transition)',
                }}
              >
                {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
              </div>

              <span
                style={{
                  marginTop: '0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? '700' : '500',
                  color: isCompleted
                    ? 'var(--text-main)'
                    : isCurrent && isRejected
                    ? '#f87171'
                    : 'var(--text-dim)',
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Special Status Highlights if Rejected / Reopened */}
      {isRejected && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: 'var(--status-rejected-bg)',
            border: '1px solid var(--status-rejected-border)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontWeight: '700' }}>Note:</span> This complaint has been reviewed and marked as Rejected by college administration.
        </div>
      )}

      {isReopened && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: 'var(--status-reopened-bg)',
            border: '1px solid var(--status-reopened-border)',
            borderRadius: 'var(--radius-md)',
            color: '#d8b4fe',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontWeight: '700' }}>Reopened:</span> This issue was reopened for further review.
        </div>
      )}

      {/* Detailed Chronological History Log */}
      <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
        Status History & Activity Log
      </h4>

      {timeline.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No activity records found.</p>
      ) : (
        <div className="timeline-container">
          {timeline.map((entry, index) => (
            <div key={index} className="timeline-item">
              <div
                className={`timeline-dot ${
                  entry.status === 'Resolved' ? 'completed' : ''
                }`}
              >
                <Clock size={12} color="currentColor" />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <StatusBadge status={entry.status} />
                    <span className="timeline-user">
                      by {entry.updatedByName || 'System'} ({entry.updatedByRole || 'System'})
                    </span>
                  </div>
                  <span className="timeline-time">
                    {formatDateTime(entry.timestamp)}
                  </span>
                </div>
                {entry.remark && (
                  <p className="timeline-remark">{entry.remark}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
