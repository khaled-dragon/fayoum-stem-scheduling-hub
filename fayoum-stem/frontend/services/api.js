import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authService = {
  signUp: (data) => api.post('/auth/signup', data),
  signIn: (data) => api.post('/auth/signin', data),
  getMe: () => api.get('/auth/me'),
};

// Schedules
export const scheduleService = {
  getAll: () => api.get('/schedules'),
  getByClass: (className) => api.get(`/schedules/${encodeURIComponent(className)}`),
  upload: (formData) =>
    api.post('/schedules/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imageUrl}`;
};

export default api;
