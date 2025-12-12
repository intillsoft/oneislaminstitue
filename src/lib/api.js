/**
 * API Service Layer
 * Centralized API client with error handling and authentication
 */

import axios from 'axios';
import { supabase } from './supabase';

// Create axios instance
// Define the backend root URL (no /api)
const API_ROOT = import.meta.env.VITE_API_URL || 'https://workflow-d9q5.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      const isConnectionRefused = error.message?.includes('ERR_CONNECTION_REFUSED') ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('Network Error') ||
        (error.request && !error.response);

      if (isConnectionRefused) {
        const isProd = window.location.hostname !== 'localhost';
        const msg = isProd
          ? 'Unable to connect to the server. Please check your connection or try again later.'
          : 'Cannot connect to backend server. Please make sure the backend is running on http://localhost:3001. Start it with: cd backend && npm start';
        return Promise.reject(new Error(msg));
      }

      return Promise.reject(new Error('Network error. Please check your internet connection and try again.'));
    }

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh session
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

      if (!refreshError && session) {
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return api(originalRequest);
      }

      // Redirect to login if refresh fails
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please sign in again.'));
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'));
    }

    // Handle 404 - Not Found
    if (error.response?.status === 404) {
      return Promise.reject(new Error('The requested resource was not found.'));
    }

    // Handle 500 - Server Error
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later or contact support.'));
    }

    // Return user-friendly error message
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// API Methods
export const apiService = {
  // Jobs
  jobs: {
    getAll: (params = {}) => api.get('/jobs', { params }),
    getById: (id) => api.get(`/jobs/${id}`),
    search: (query, filters = {}) => api.post('/jobs/search', { query, filters }),
    create: (data) => api.post('/jobs', data),
    update: (id, data) => api.put(`/jobs/${id}`, data),
    delete: (id) => api.delete(`/jobs/${id}`),
    apply: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
  },

  // Applications
  applications: {
    getAll: (params = {}) => api.get('/applications', { params }),
    getById: (id) => api.get(`/applications/${id}`),
    updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
    getAnalytics: () => api.get('/applications/analytics'),
  },

  // Resumes
  resumes: {
    getAll: () => api.get('/resumes'),
    getById: (id) => api.get(`/resumes/${id}`),
    create: (data) => api.post('/resumes', data),
    update: (id, data) => api.put(`/resumes/${id}`, data),
    delete: (id) => api.delete(`/resumes/${id}`),
    setDefault: (id) => api.patch(`/resumes/${id}/default`),
    generate: (data) => api.post('/resumes/generate', data),
    export: (id, format) => api.get(`/resumes/${id}/export`, { params: { format } }),
  },

  // Saved Jobs
  savedJobs: {
    getAll: () => api.get('/saved-jobs'),
    save: (jobId) => api.post('/saved-jobs', { job_id: jobId }),
    unsave: (jobId) => api.delete(`/saved-jobs/${jobId}`),
  },

  // Job Alerts
  alerts: {
    getAll: () => api.get('/job-alerts'),
    create: (data) => api.post('/job-alerts', data),
    update: (id, data) => api.patch(`/job-alerts/${id}`, data),
    delete: (id) => api.delete(`/job-alerts/${id}`),
  },

  // AI Services
  ai: {
    generateResume: (data) => api.post('/resumes/generate', data, { timeout: 180000 }),
    matchJob: (resumeId, jobId, aiProvider = null) => api.post('/jobs/match', { resume_id: resumeId, job_id: jobId, ai_provider: aiProvider }, { timeout: 60000 }),
    generateQuestions: (data) => api.post('/interview/questions/generate', data, { timeout: 120000 }),
    analyzeAnswer: (data) => api.post('/interview/analyze', data, { timeout: 120000 }),
    predictSalary: (data) => api.post('/salary/predict', data, { timeout: 60000 }),
    analyzeCareer: () => api.get('/career/analyze', { timeout: 120000 }),
    search: (data) => api.post('/ai/search', data, { timeout: 60000 }),
    chatWithAdvisor: (data) => api.post('/ai/career/chat', data, { timeout: 60000 }),
    saveChatHistory: (data) => api.post('/ai/chat/history', data),
    getChatHistory: (params) => api.get('/ai/chat/history', { params }),
    getMarketInsights: () => api.get('/ai/career/market-insights', { timeout: 60000 }),
    getSkillAnalysis: () => api.get('/ai/career/skill-analysis', { timeout: 60000 }),
    generateCompletion: (data) => api.post('/ai/completion', data, { timeout: 120000 }),
    validateInput: (data) => api.post('/ai/validate', data, { timeout: 60000 }),
    getRecommendations: (params) => api.get('/recommendations/jobs', { params, timeout: 60000 }),

    // Talent AI
    optimizeGig: (data) => api.post('/ai/talent/gig-doctor', data, { timeout: 120000 }),
    analyzeRates: (data) => api.post('/ai/talent/rate-intel', data, { timeout: 60000 }),
    generateProposal: (data) => api.post('/ai/talent/proposal', data, { timeout: 120000 }),
    analyzeClientVibe: (data) => api.post('/ai/talent/vibe-check', data, { timeout: 60000 }),
    verifySkill: (data) => api.post('/ai/talent/skill-verify', data, { timeout: 120000 }),
    suggestUpsell: (data) => api.post('/ai/talent/upsell', data, { timeout: 60000 }),
    forecastEarnings: (data) => api.post('/ai/talent/forecast', data, { timeout: 60000 }),
  },

  // Chat Services (Bolt.new style)
  chat: {
    stream: (message, conversationHistory = []) => {
      // Note: Streaming uses fetch, not axios
      return fetch(`${API_ROOT}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession().then(({ data }) => data.session?.access_token)}`, // Needs token for auth
        },
        body: JSON.stringify({ message, conversation_history: conversationHistory }),
      });
    },
    send: (message, conversationHistory = []) => api.post('/chat', { message, conversation_history: conversationHistory }),
    getHistory: () => api.get('/chat/history'),
    saveHistory: (messages) => api.post('/chat/history', { messages }),
  },

  // Direct API methods for components that need them
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),

  // Job Crawler Services
  jobCrawler: {
    crawl: (data) => api.post('/job-crawler/crawl', data),
    schedule: () => api.post('/job-crawler/schedule'),
    getStatus: () => api.get('/job-crawler/status'),
  },

  // Talent Marketplace Services
  talent: {
    // Profile
    getProfile: (id) => api.get(`/talent/profile/${id}`),
    createOrUpdateProfile: (data) => api.post('/talent/profile', data),

    // Gigs
    getGigs: (params) => api.get('/talent/gigs', { params }),
    getGig: (id) => api.get(`/talent/gigs/${id}`),
    createGig: (data) => api.post('/talent/gigs', data),
    updateGig: (id, data) => api.put(`/talent/gigs/${id}`, data),
    deleteGig: (id) => api.delete(`/talent/gigs/${id}`),

    // Orders
    getOrders: (params) => api.get('/talent/orders', { params }),
    createOrder: (data) => api.post('/talent/orders', data),
    updateOrder: (id, data) => api.put(`/talent/orders/${id}`, data),

    // Messages
    getMessages: (params) => api.get('/talent/messages', { params }),
    sendMessage: (data) => api.post('/talent/messages', data),

    // Discovery
    discoverTalents: (params) => api.get('/talent/discover', { params }),

    // Dashboard
    getDashboard: () => api.get('/talent/dashboard'),
    getDashboardStats: () => api.get('/talent/dashboard/stats'),

    // Conversations
    getConversations: () => api.get('/talent/conversations'),

    // Deliver Order
    deliverOrder: (orderId, data) => api.post(`/talent/orders/${orderId}/deliver`, data),
  },

  // Applications
  applications: {
    create: (data) => api.post('/applications', data),
    getByJobId: (jobId) => api.get(`/applications/job/${jobId}`),
  },

  // User Profile
  profile: {
    get: () => api.get('/profile'),
    update: (data) => api.put('/profile', data),
    uploadAvatar: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    requestRoleChange: (data) => api.post('/profile/request-role-change', data),
    getRoleChangeRequests: () => api.get('/profile/role-change-requests'),
    approveRoleChangeRequest: (id) => api.put(`/profile/role-change-requests/${id}/approve`),
    rejectRoleChangeRequest: (id, data) => api.put(`/profile/role-change-requests/${id}/reject`, data),
  },

  // Companies
  companies: {
    getAll: (params = {}) => api.get('/companies', { params }),
    getById: (id) => api.get(`/companies/${id}`),
    create: (data) => api.post('/companies', data),
    update: (id, data) => api.put(`/companies/${id}`, data),
    getJobs: (companyId) => api.get(`/companies/${companyId}/jobs`),
  },

  // Subscriptions
  subscriptions: {
    getCurrent: () => api.get('/billing/subscription'),
    createCheckout: (tier) => api.post('/billing/checkout', { tier }),
    createPortal: () => api.post('/billing/portal'),
    update: (tier) => api.post('/billing/subscription/update', { tier }),
    cancel: () => api.post('/billing/subscription/cancel'),
  },

  // Email Preferences
  email: {
    getPreferences: () => api.get('/email/preferences'),
    updatePreference: (emailType, enabled) => api.put(`/email/preferences/${emailType}`, { enabled }),
    unsubscribe: (token) => api.post('/email/unsubscribe', { token }),
  },

  // Unified Messaging System (for all roles)
  messages: {
    // Conversations
    getConversations: () => api.get('/messages/conversations'),
    getConversation: (userId) => api.get(`/messages/conversation/${userId}`),

    // Messages
    getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
    sendMessage: (conversationId, data) => api.post(`/messages/${conversationId}`, data),
    markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),

    // AI Features
    getAISuggestions: (conversationId, context) => api.post('/messages/ai/suggestions', { conversationId, context }),
    improveMessage: (message, improvementType) => api.post('/messages/ai/improve', { message, improvement_type: improvementType }),
  },

  // Admin Endpoints
  admin: {
    getDashboard: (dateRange) => api.get('/admin/dashboard', { params: { dateRange } }),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    suspendUser: (id, reason) => api.post(`/admin/users/${id}/suspend`, { reason }),
    getJobs: (params) => api.get('/admin/jobs', { params }),
    getApplications: (params) => api.get('/admin/applications', { params }),
    getAnalytics: (dateRange) => api.get('/admin/analytics', { params: { dateRange } }),
    getModeration: (params) => api.get('/admin/moderation', { params }),
    approveModeration: (id) => api.post(`/admin/moderation/${id}/approve`),
    rejectModeration: (id, reason) => api.post(`/admin/moderation/${id}/reject`, { reason }),
    updateSettings: (data) => api.put('/admin/settings', data),
    getReports: () => api.get('/admin/reports'),
    generateReport: (data) => api.post('/admin/reports/generate', data),
  },

  // Statistics Endpoints
  statistics: {
    getOverview: (dateRange) => api.get('/statistics/overview', { params: { dateRange } }),
    getUserStats: () => api.get('/statistics/user'),
    getJobStats: (dateRange) => api.get('/statistics/jobs', { params: { dateRange } }),
    getApplicationStats: (dateRange) => api.get('/statistics/applications', { params: { dateRange } }),
    getRevenueStats: (dateRange) => api.get('/statistics/revenue', { params: { dateRange } }),
  },

  // Autopilot Endpoints (formerly Auto-Apply)
  autopilot: {
    getSettings: () => api.get('/autopilot/settings'),
    saveSettings: (data) => api.post('/autopilot/settings', data),
    getLogs: (params) => api.get('/autopilot/logs', { params }),
    process: () => api.post('/autopilot/process'),
  },
  // Legacy Auto-Apply Endpoints (for backward compatibility)
  autoApply: {
    getSettings: () => api.get('/autopilot/settings'),
    saveSettings: (data) => api.post('/autopilot/settings', data),
    getLogs: (params) => api.get('/autopilot/logs', { params }),
    process: () => api.post('/autopilot/process'),
  },

  // Notification Endpoints
  notifications: {
    getAll: (params) => api.get('/notifications', { params }),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    delete: (id) => api.delete(`/notifications/${id}`),
    getPreferences: () => api.get('/notifications/preferences'),
    updatePreferences: (data) => api.put('/notifications/preferences', data),
  },

  // Subscription Endpoints
  subscriptions: {
    getPlans: () => api.get('/subscriptions/plans'),
    getCurrent: () => api.get('/subscriptions/current'),
    upgrade: (data) => api.post('/subscriptions/upgrade', data),
    cancel: () => api.post('/subscriptions/cancel'),
  },

  // Recruiter Endpoints
  recruiter: {
    getDashboard: (dateRange) => api.get('/recruiter/dashboard', { params: { dateRange } }),
    getJobs: (params) => api.get('/recruiter/jobs', { params }),
    createJob: (data) => api.post('/recruiter/jobs', data),
    getJobById: (id) => api.get(`/recruiter/jobs/${id}`),
    updateJob: (id, data) => api.put(`/recruiter/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/recruiter/jobs/${id}`),
    publishJob: (id) => api.post(`/recruiter/jobs/${id}/publish`),
    deactivateJob: (id) => api.post(`/recruiter/jobs/${id}/deactivate`),
    getJobApplicants: (jobId, params) => api.get(`/recruiter/jobs/${jobId}/applicants`, { params }),
    updateApplicantStatus: (jobId, applicantId, status, notes) =>
      api.put(`/recruiter/jobs/${jobId}/applicants/${applicantId}`, { status, notes }),
    getCandidates: (params) => api.get('/recruiter/candidates', { params }),
    getCandidateById: (id) => api.get(`/recruiter/candidates/${id}`),
    saveCandidate: (id) => api.post(`/recruiter/candidates/${id}/save`),
    getAnalytics: (dateRange) => api.get('/recruiter/analytics', { params: { dateRange } }),
    updateSettings: (data) => api.put('/recruiter/settings', data),
    sendEmail: (data) => api.post('/recruiter/emails/send', data),
    scheduleInterview: (data) => api.post('/recruiter/interviews/schedule', data),
  },
};

export default api;