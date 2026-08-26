import api from './api';

export const complaintService = {
  createComplaint: async (formData) => {
    const res = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getComplaints: async (params = {}) => {
    const res = await api.get('/complaints', { params });
    return res.data;
  },

  getComplaintById: async (id) => {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  },

  updateComplaint: async (id, formData) => {
    const res = await api.put(`/complaints/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updateStatus: async (id, status, remark) => {
    const res = await api.put(`/complaints/${id}/status`, { status, remark });
    return res.data;
  },

  assignStaff: async (id, staffId, remark) => {
    const res = await api.put(`/complaints/${id}/assign`, { staffId, remark });
    return res.data;
  },

  addResponse: async (id, message) => {
    const res = await api.post(`/complaints/${id}/response`, { message });
    return res.data;
  },

  reopenComplaint: async (id, reason) => {
    const res = await api.post(`/complaints/${id}/reopen`, { reason });
    return res.data;
  },

  deleteComplaint: async (id) => {
    const res = await api.delete(`/complaints/${id}`);
    return res.data;
  },
};
