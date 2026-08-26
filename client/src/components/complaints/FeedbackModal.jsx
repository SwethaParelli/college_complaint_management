import React, { useState } from 'react';
import Modal from '../common/Modal';
import { feedbackService } from '../../services/feedbackService';
import { useToast } from '../../context/ToastContext';
import { Star, HeartHandshake } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, complaint, onFeedbackSubmitted }) => {
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.warning('Please select a star rating (1-5).');
      return;
    }

    try {
      setLoading(true);
      const res = await feedbackService.createFeedback({
        complaintId: complaint._id,
        rating,
        comment,
      });

      if (res.success) {
        toast.success('Thank you for rating our resolution!');
        onFeedbackSubmitted && onFeedbackSubmitted(res.feedback);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resolution Feedback & Rating"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1rem' }}>
            How satisfied are you with the resolution of complaint{' '}
            <span style={{ color: 'var(--primary-400)', fontWeight: '600' }}>
              {complaint?.complaintId}
            </span>
            ?
          </p>

          {/* Interactive Star Rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'transform 0.15s ease',
                    transform: active ? 'scale(1.15)' : 'scale(1)',
                  }}
                  aria-label={`${star} star`}
                >
                  <Star
                    size={32}
                    color={active ? '#f59e0b' : 'var(--text-dim)'}
                    fill={active ? '#f59e0b' : 'transparent'}
                  />
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: '600' }}>
            {rating === 5
              ? 'Excellent (5/5)'
              : rating === 4
              ? 'Good (4/5)'
              : rating === 3
              ? 'Satisfactory (3/5)'
              : rating === 2
              ? 'Needs Improvement (2/5)'
              : 'Poor (1/5)'}
          </span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="feedbackComment">
            Additional Comments or Appreciation (Optional)
          </label>
          <textarea
            id="feedbackComment"
            className="form-control"
            rows="3"
            placeholder="Share your experience regarding the speed and quality of resolution..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
            disabled={loading}
          >
            <HeartHandshake size={16} />
            <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;
