import axios from 'axios';

const API_BASE_URL ='https://nek-kaam-foundationb.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Add token to requests
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const memberToken = localStorage.getItem('memberToken');
  const token = adminToken || memberToken;
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
      if (localStorage.getItem('adminToken')) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else if (localStorage.getItem('memberToken')) {
        localStorage.removeItem('memberToken');
        window.location.href = '/member-login';
      } else {
        window.location.href = '/member-login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  adminLogin: (credentials) => api.post('/api/auth/admin/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  verifyAdmin: () => api.get('/api/auth/verify'),
};

// Member endpoints
export const memberAPI = {
  register: (data) => api.post('/api/members/register', data),
  login: (data) => api.post('/api/members/login', data),
  getProfile: () => api.get('/api/members/profile'),
  updateProfile: (data) => api.put('/api/members/profile', data),
  getAllMembers: (params) => api.get('/api/members', { params }),
  getMemberById: (id) => api.get(`/api/members/${id}`),
  deleteMember: (id) => api.delete(`/api/members/${id}`),
  getMemberCount: () => api.get('/api/members/stats/count'),
  updateAvatar: (formData) => {
    return api.post('/api/members/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Project endpoints
export const projectAPI = {
  getAll: (params) => api.get('/api/projects', { params }),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post('/api/projects', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
  getCounts: () => api.get('/api/projects/stats/counts'),
};

// Activity endpoints
export const activityAPI = {
  getAll: (params) => api.get('/api/activities', { params }),
  getById: (id) => api.get(`/api/activities/${id}`),
  create: (data) => api.post('/api/activities', data),
  update: (id, data) => api.put(`/api/activities/${id}`, data),
  delete: (id) => api.delete(`/api/activities/${id}`),
};

// Fund endpoints
// Fund endpoints
export const fundAPI = {
  getTotalCollections: () => api.get('/api/funds/collections/total'),
  getCollections: () => api.get('/api/funds/collections'),
  getUsage: (params) => api.get('/api/funds/usages', { params }),
  createCollection: (data) => api.post('/api/funds/collections', data),
  createUsage: (data) => api.post('/api/funds/usages', data),
  deleteCollection: (id) => api.delete(`/api/funds/collections/${id}`),
  deleteUsage: (id) => api.delete(`/api/funds/usages/${id}`),
  getSummary: () => api.get('/api/funds/summary'),
};

// Impact Story endpoints
export const impactStoryAPI = {
  getAll: (params) => api.get('/api/impact-stories', { params }),
  getById: (id) => api.get(`/api/impact-stories/${id}`),
  create: (data) => api.post('/api/impact-stories', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  update: (id, data) => api.put(`/api/impact-stories/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
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

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getMonthlyFunds: () => api.get('/api/dashboard/charts/monthly-funds'),
  getMemberGrowth: () => api.get('/api/dashboard/charts/member-growth'),
  getCategoryUsage: () => api.get('/api/dashboard/charts/category-usage'),
  getRecentActivities: () => api.get('/api/dashboard/recent-activities'),
};

// Setting endpoints
export const settingAPI = {
  getSettings: () => api.get('/api/settings'),
  updateSettings: (data) => api.put('/api/settings', data),
};

// Public endpoints (no auth required)
export const publicAPI = {
  getStats: () => api.get('/api/public/stats'),
  getProjectsPreview: () => api.get('/api/public/projects'),
  getActivitiesPreview: () => api.get('/api/public/activities'),
  getNewsPreview: () => api.get('/api/public/news'),
};

export default api;
