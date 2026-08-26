import api from './api';

export const feedbackService = {
  createFeedback: async (feedbackData) => {
    const res = await api.post('/feedback', feedbackData);
    return res.data;
  },

  getFeedback: async (params = {}) => {
    const res = await api.get('/feedback', { params });
    return res.data;
  },
};
