import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://job-board-platform-3s4b.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authApi = {
    registerCandidate: (data) => api.post('/auth/candidate/register', data),
    loginCandidate: (data) => api.post('/auth/candidate/login', data),
    registerEmployer: (data) => api.post('/auth/employer/register', data),
    loginEmployer: (data) => api.post('/auth/employer/login', data),
};

// Jobs API
export const jobsApi = {
    getAll: (params = {}) => api.get('/jobs', { params }),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (data) => api.post('/jobs', data),
    update: (id, data) => api.put(`/jobs/${id}`, data),
    delete: (id) => api.delete(`/jobs/${id}`),
    getMyJobs: () => api.get('/jobs/my-jobs'),
};

// Resume API
export const resumeApi = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('resume', file);
        return api.post('/resumes', formData);
    },
    getMyResumes: () => api.get('/resumes/my'),
    deleteResume: (id) => api.delete(`/resumes/${id}`),
};

// Applications API - For candidates
export const applicationsApi = {
    apply: (data) => api.post('/applications', data),
    getMyApplications: () => api.get('/applications/my'),
    updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
    getMyApplication: (id) => api.get(`/applications/my/${id}`),
};

// Employer API - For employers to view applications
export const employerApi = {
    getApplications: () => api.get('/employer/applications'),
    getApplicationDetails: (id) => api.get(`/employer/applications/${id}`),
    updateApplicationStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

// Notifications API
export const notificationsApi = {
    getMyNotifications: () => api.get('/notifications'),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
};

// Admin API 
export const adminApi = {
    getUsers: () => api.get('/admin/users'),
    getReports: () => api.get('/admin/reports'),
    deleteUser: (id, type) => api.delete(`/admin/users/${id}?type=${type}`),
    deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
    getAllJobs: () => api.get('/admin/jobs'),
};