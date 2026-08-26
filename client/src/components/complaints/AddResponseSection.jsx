import React, { useState } from 'react';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';
import { Send, Shield, User, MessageSquare } from 'lucide-react';

const AddResponseSection = ({ complaintId, responses = [], onResponseAdded }) => {
  const toast = useToast();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.warning('Please enter a response message.');
      return;
    }

    try {
      setLoading(true);
      const res = await complaintService.addResponse(complaintId, message);
      if (res.success) {
        toast.success('Response posted successfully!');
        setMessage('');
        onResponseAdded && onResponseAdded(res.responses);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1rem',
        }}
      >
        <MessageSquare size={20} color="var(--primary-400)" />
        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
          Communication & Response Thread ({responses.length})
        </h4>
      </div>

      {/* Responses List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {responses.length === 0 ? (
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-dim)',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}
          >
            No official responses or notes have been added yet.
          </div>
        ) : (
          responses.map((resp, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.15rem 1.35rem',
                borderRadius: 'var(--radius-md)',
                background: resp.isOfficial
                  ? 'rgba(79, 70, 229, 0.08)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: resp.isOfficial
                  ? '1px solid rgba(99, 102, 241, 0.3)'
                  : '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {resp.isOfficial ? (
                    <Shield size={16} color="#818cf8" />
                  ) : (
                    <User size={16} color="var(--text-muted)" />
                  )}
                  <span
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      color: resp.isOfficial ? 'var(--primary-400)' : 'var(--text-main)',
                    }}
                  >
                    {resp.senderName || resp.sender?.name || 'User'}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: resp.isOfficial
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(255, 255, 255, 0.08)',
                      color: resp.isOfficial ? '#a5b4fc' : 'var(--text-dim)',
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                    }}
                  >
                    {resp.senderRole ? resp.senderRole.toUpperCase() : 'OFFICIAL'}
                  </span>
                </div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>
                  {formatDateTime(resp.createdAt)}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-main)',
                  lineHeight: '1.55',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {resp.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Response Input Box */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="newResponseMessage">
            Add a Reply / Action Remark
          </label>
          <textarea
            id="newResponseMessage"
            className="form-control"
            rows="3"
            placeholder="Type your message, query, or clarification here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !message.trim()}
          style={{ marginLeft: 'auto', display: 'flex' }}
        >
          <Send size={16} />
          <span>{loading ? 'Posting...' : 'Post Response'}</span>
        </button>
      </form>
    </div>
  );
};

export default AddResponseSection;
