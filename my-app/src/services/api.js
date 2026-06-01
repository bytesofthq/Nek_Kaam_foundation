import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('memberToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('memberToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  adminLogin: (credentials) => api.post('/api/auth/admin/login', credentials),
  memberLogin: (credentials) => api.post('/api/auth/member/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  verifyAdmin: () => api.get('/api/auth/verify'),
  verifyMember: () => api.get('/api/auth/member/verify'),
};

// Member endpoints
export const memberAPI = {
  register: (data) => api.post('/api/members/register', data),
  getProfile: () => api.get('/api/members/profile'),
  updateProfile: (data) => api.put('/api/members/profile', data),
  getAllMembers: () => api.get('/api/members'),
  getMemberById: (id) => api.get(`/api/members/${id}`),
  deleteMember: (id) => api.delete(`/api/members/${id}`),
  getMemberCount: () => api.get('/api/members/stats/count'),
};

// Project endpoints
export const projectAPI = {
  getAll: () => api.get('/api/projects'),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post('/api/projects', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
  getCounts: () => api.get('/api/projects/stats/counts'),
};

// Activity endpoints
export const activityAPI = {
  getAll: () => api.get('/api/activities'),
  getById: (id) => api.get(`/api/activities/${id}`),
  create: (data) => api.post('/api/activities', data),
  update: (id, data) => api.put(`/api/activities/${id}`, data),
  delete: (id) => api.delete(`/api/activities/${id}`),
};

// Fund endpoints
export const fundAPI = {
  getCollections: () => api.get('/api/funds/collections'),
  getUsage: () => api.get('/api/funds/usage'),
  createCollection: (data) => api.post('/api/funds/collections', data),
  createUsage: (data) => api.post('/api/funds/usage', data),
};

// Impact Story endpoints
export const impactStoryAPI = {
  getAll: () => api.get('/api/impact-stories'),
  getById: (id) => api.get(`/api/impact-stories/${id}`),
  create: (data) => api.post('/api/impact-stories', data),
  update: (id, data) => api.put(`/api/impact-stories/${id}`, data),
  delete: (id) => api.delete(`/api/impact-stories/${id}`),
};

// Committee endpoints
export const committeeAPI = {
  getAll: () => api.get('/api/committee'),
  getById: (id) => api.get(`/api/committee/${id}`),
  create: (data) => api.post('/api/committee', data),
  update: (id, data) => api.put(`/api/committee/${id}`, data),
  delete: (id) => api.delete(`/api/committee/${id}`),
};

// Gallery endpoints
export const galleryAPI = {
  getAll: () => api.get('/api/gallery'),
  getById: (id) => api.get(`/api/gallery/${id}`),
  create: (data) => api.post('/api/gallery', data),
  update: (id, data) => api.put(`/api/gallery/${id}`, data),
  delete: (id) => api.delete(`/api/gallery/${id}`),
};

// Testimonial endpoints
export const testimonialAPI = {
  getAll: () => api.get('/api/testimonials'),
  getById: (id) => api.get(`/api/testimonials/${id}`),
  create: (data) => api.post('/api/testimonials', data),
  update: (id, data) => api.put(`/api/testimonials/${id}`, data),
  delete: (id) => api.delete(`/api/testimonials/${id}`),
};

// News endpoints
export const newsAPI = {
  getAll: () => api.get('/api/news'),
  getById: (id) => api.get(`/api/news/${id}`),
  create: (data) => api.post('/api/news', data),
  update: (id, data) => api.put(`/api/news/${id}`, data),
  delete: (id) => api.delete(`/api/news/${id}`),
};

// Message endpoints
export const messageAPI = {
  sendMessage: (data) => api.post('/api/messages', data),
  getMessages: () => api.get('/api/messages'),
  getMessageById: (id) => api.get(`/api/messages/${id}`),
};

// Public endpoints (no auth required)
export const publicAPI = {
  getStats: () => api.get('/api/public/stats'),
  getProjectsPreview: () => api.get('/api/public/projects'),
  getActivitiesPreview: () => api.get('/api/public/activities'),
  getNewsPreview: () => api.get('/api/public/news'),
};

export default api;
