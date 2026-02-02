import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://job-board-platform-3s4b.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
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
    getMyJobs: () => api.get('/jobs/my-jobs'), // You may need to add this endpoint
};

// Resume API (for uploading CVs)
export const resumeApi = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('resume', file);
        return api.post('/resumes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getMyResumes: () => api.get('/resumes/my'),
};

// Applications API
export const applicationsApi = {
    apply: (data) => api.post('/applications', data), // { jobId, resumeId, coverLetter? }
    getMyApplications: () => api.get('/applications/my'),
    updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
    getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`), // You may need this
};

// Notifications API
export const notificationsApi = {
    getMyNotifications: () => api.get('/notifications/my'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
};