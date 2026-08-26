import React, { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  AlertTriangle,
  Folder,
} from 'lucide-react';

const ManageCategories = () => {
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      toast.error('Failed to load complaint categories.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAddModal = () => {
    setFormData({ name: '', description: '' });
    setIsAddOpen(true);
  };

  const openEditModal = (cat) => {
    setEditCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      const res = await categoryService.createCategory(formData);
      if (res.success) {
        toast.success(`Category '${formData.name}' created!`);
        setIsAddOpen(false);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await categoryService.updateCategory(editCategory._id, formData);
      if (res.success) {
        toast.success('Category updated successfully!');
        setEditCategory(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    try {
      setDeleting(true);
      const res = await categoryService.deleteCategory(deleteCategory._id);
      if (res.success) {
        toast.success(res.message);
        setDeleteCategory(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Complaint Categories
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Configure classification taxonomy for academic, hostel, and campus infrastructure complaints
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid/Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Active Categories: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{categories.length}</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <Layers className="empty-state-icon" />
            <h3>No categories created</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Create categories so students can classify their grievances.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Filed Complaints</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(99, 102, 241, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary-400)',
                          }}
                        >
                          <Folder size={16} />
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '350px' }}>
                      {cat.description || 'No description provided.'}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-main)',
                        }}
                      >
                        {cat.complaintCount || 0} Complaints
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="btn btn-secondary btn-icon btn-sm"
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteCategory(cat)}
                          className="btn btn-danger btn-icon btn-sm"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Create New Complaint Category"
        >
          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Laboratory Equipment"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Briefly explain what type of issues fall under this category..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsAddOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !formData.name.trim()}
              >
                <PlusCircle size={16} />
                <span>{saving ? 'Creating...' : 'Create Category'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editCategory && (
        <Modal
          isOpen={!!editCategory}
          onClose={() => setEditCategory(null)}
          title={`Edit Category - ${editCategory.name}`}
        >
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditCategory(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Category Modal */}
      {deleteCategory && (
        <Modal
          isOpen={!!deleteCategory}
          onClose={() => setDeleteCategory(null)}
          title="Delete Category"
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Delete Category '{deleteCategory.name}'?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this category? Existing complaints under this category will continue to preserve their category tag.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteCategory(null)}
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
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageCategories;
