import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('voltcycle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response unwrapping & error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data || {
      success: false,
      error: error.message || 'Network error encountered. Is the server running?',
    };
    return Promise.reject(errorResponse);
  }
);

export default api;
