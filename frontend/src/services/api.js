import axios from 'axios';

// Get base URL from environment or default to local
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure the URL ends with /api for consistency
if (baseURL && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
    baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Helper methods
const get = (url, config = {}) => api.get(url, config);
const post = (url, data = {}, config = {}) => api.post(url, data, config);
const put = (url, data = {}, config = {}) => api.put(url, data, config);
const del = (url, config = {}) => api.delete(url, config);

// --- API METHODS ---

// Auth
export const login = (credentials) => post('/auth/login', credentials);
export const register = (userData) => post('/auth/register', userData);

// Projects
export const getProjects = () => get('/projects');
export const getProject = (id) => get(`/projects/${id}`);
export const createProject = (projectData) => post('/projects', projectData);
export const getClientProjects = () => get('/projects/client/my');

// Proposals & Squads
export const getProjectProposals = (projectId) => get(`/proposals/project/${projectId}`);
export const getMyProposals = () => get('/proposals/my');
export const getInvites = () => get('/squads/invites');
export const acceptInvite = (squadId) => post(`/squads/${squadId}/accept`, {});
export const rejectInvite = (squadId) => post(`/squads/${squadId}/reject`, {});
export const submitSquadProposal = (proposalData) => post('/proposals/squad', proposalData);
export const submitProposal = (proposalData) => post('/proposals', proposalData);

// Users/Freelancers
export const getFreelancer = (id) => get(`/users/freelancer/${id}`);
export const getAllFreelancers = () => get('/users/freelancers');

// AI & Reviews
export const analyzeReview = (reviewData) => post('/reviews/analyze', reviewData);
export const getReviews = (freelancerId) => get(freelancerId ? `/reviews?freelancerId=${freelancerId}` : '/reviews');

// Health
export const healthCheck = () => get('/health');

export default {
    login,
    register,
    getProjects,
    getProject,
    createProject,
    getClientProjects,
    getFreelancer,
    getAllFreelancers,
    getMyProposals,
    getProjectProposals,
    getInvites,
    acceptInvite,
    rejectInvite,
    submitSquadProposal,
    submitProposal,
    analyzeReview,
    getReviews,
    healthCheck,
};
