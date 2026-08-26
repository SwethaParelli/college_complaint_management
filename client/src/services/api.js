import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token to every outgoing request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('college_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for centralized error and session handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local auth
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        currentPath !== '/'
      ) {
        localStorage.removeItem('college_auth_token');
        localStorage.removeItem('college_auth_user');
        // window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
