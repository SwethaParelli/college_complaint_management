import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { feedbackService } from '../../services/feedbackService';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatters';
import { Star, HeartHandshake, Eye, MessageSquare } from 'lucide-react';

const FeedbackList = () => {
  const toast = useToast();

  const [feedbacks, setFeedbacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [distribution, setDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const res = await feedbackService.getFeedback({
        page: currentPage,
        limit: 10,
      });

      if (res.success) {
        setFeedbacks(res.feedbacks);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setAverageRating(res.averageRating);
        setTotalFeedbacks(res.totalFeedbacks);
        if (res.distribution) setDistribution(res.distribution);
      }
    } catch (err) {
      toast.error('Failed to load feedback records.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
          Student Feedback & Satisfaction
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Evaluate student ratings and qualitative comments submitted after complaint resolution
        </p>
      </div>

      {/* Overview Analytics Card */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        {/* Left Big Score */}
        <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)', paddingRight: '1.5rem' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#f59e0b', lineHeight: 1 }}>
            {averageRating}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', margin: '0.5rem 0' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                color={s <= Math.round(averageRating) ? '#f59e0b' : 'var(--text-dim)'}
                fill={s <= Math.round(averageRating) ? '#f59e0b' : 'transparent'}
              />
            ))}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Average institutional rating based on{' '}
            <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{totalFeedbacks}</span> student reviews
          </div>
        </div>

        {/* Right Star Distribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0;

            return (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ width: '50px', color: 'var(--text-muted)' }}>{stars} Stars</span>
                <div
                  style={{
                    flex: 1,
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: stars >= 4 ? '#10b981' : stars === 3 ? '#f59e0b' : '#ef4444',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <span style={{ width: '40px', textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Reviews Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
          Recent Student Reviews ({total})
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            Loading reviews...
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state">
            <HeartHandshake className="empty-state-icon" />
            <h3>No feedback entries recorded yet</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Feedback will appear here as students review resolved complaints.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Student</th>
                  <th>Complaint Reference</th>
                  <th>Comments / Appreciation</th>
                  <th>Submitted Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            color={s <= item.rating ? '#f59e0b' : 'var(--text-dim)'}
                            fill={s <= item.rating ? '#f59e0b' : 'transparent'}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                        {item.student?.name || 'Student'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {item.student?.department || 'Department'}
                      </div>
                    </td>
                    <td>
                      <span className="code-id">{item.complaint?.complaintId}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {item.complaint?.title}
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {item.comment ? `"${item.comment}"` : <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No comment provided</span>}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {formatDate(item.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {item.complaint && (
                        <Link
                          to={`/admin/complaints/${item.complaint._id || item.complaint.complaintId}`}
                          className="btn btn-secondary btn-icon btn-sm"
                          title="View Ticket"
                        >
                          <Eye size={14} />
                        </Link>
                      )}
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
    </div>
  );
};

export default FeedbackList;
