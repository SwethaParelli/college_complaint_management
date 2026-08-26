import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { COMPLAINT_PRIORITIES } from '../../utils/constants';
import {
  PlusCircle,
  Upload,
  FileText,
  X,
  Lock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'Medium',
    anonymous: false,
  });

  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setFetchingCategories(true);
        const res = await categoryService.getCategories();
        if (res.success && res.categories.length > 0) {
          setCategories(res.categories);
          setFormData((prev) => ({ ...prev, category: res.categories[0].name }));
        }
      } catch (err) {
        toast.error('Failed to load complaint categories.');
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCats();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate size (5MB per file) and types
    for (const f of selectedFiles) {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`File "${f.name}" exceeds the 5MB size limit.`);
        return;
      }
    }

    setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));

    // Generate previews
    const previews = selectedFiles.map((f) => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      isImage: f.type.startsWith('image/'),
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    }));

    setFilePreviews((prev) => [...prev, ...previews].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setFilePreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description || !formData.location) {
      toast.warning('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('priority', formData.priority);
      data.append('anonymous', formData.anonymous);

      files.forEach((file) => {
        data.append('evidence', file);
      });

      const res = await complaintService.createComplaint(data);

      if (res.success) {
        toast.success(`Complaint ${res.complaint.complaintId} submitted successfully!`);
        navigate(`/student/track/${res.complaint._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '880px' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusCircle size={20} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.45rem', color: 'var(--text-main)' }}>
              Submit Grievance / Complaint
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Fill in the details below. A unique Complaint ID will be automatically generated.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Complaint Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="compTitle">
              Complaint Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="compTitle"
              name="title"
              type="text"
              className="form-control"
              placeholder="e.g. Lab 202 High-Performance Machine Boot Failure"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="compCategory">
                Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="compCategory"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="compPriority">
                Priority Level <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="compPriority"
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                {COMPLAINT_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p} {p === 'Critical' ? '⚠️ (Emergency)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="compLocation">
              Campus Location / Room / Block <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="compLocation"
              name="location"
              type="text"
              className="form-control"
              placeholder="e.g. Academic Block B, 2nd Floor, Room 204 or Hostel C Mess"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="compDescription">
              Detailed Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              id="compDescription"
              name="description"
              className="form-control"
              rows="4"
              placeholder="Provide specific details regarding when the issue occurred, affected systems, and impact..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Evidence Upload */}
          <div className="form-group">
            <label className="form-label">
              Attach Evidence / Photos / PDF (Optional, max 5 files, 5MB each)
            </label>
            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.01)',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              />
              <Upload size={28} color="var(--primary-400)" style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Click to browse or drop photos/documents here
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Supported Formats: JPG, JPEG, PNG, PDF
              </div>
            </div>

            {/* File Previews List */}
            {filePreviews.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {filePreviews.map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <FileText size={14} color="var(--primary-400)" />
                    <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.name}
                    </span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>({f.size})</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '2px',
                      }}
                      aria-label="Remove attachment"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous Reporting Option */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'rgba(79, 70, 229, 0.06)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Lock size={20} color="#818cf8" />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Submit Anonymously
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  Your name and student ID will be masked from normal department staff views.
                </div>
              </div>
            </div>
            <label className="form-checkbox-label" style={{ margin: 0 }}>
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/student/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              <PlusCircle size={18} />
              <span>{loading ? 'Submitting Grievance...' : 'Submit Complaint'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
