import api from './api';

export const dashboardService = {
  getAdminDashboard: async () => {
    const res = await api.get('/dashboard/admin');
    return res.data;
  },

  getStudentDashboard: async () => {
    const res = await api.get('/dashboard/student');
    return res.data;
  },

  getStaffDashboard: async () => {
    const res = await api.get('/dashboard/staff');
    return res.data;
  },
};
