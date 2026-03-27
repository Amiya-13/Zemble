import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Generic Methods
export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);

// Auth
export const login = (credentials) => post('/auth/login', credentials);
export const register = (userData) => post('/auth/register', userData);

// Projects
export const getProjects = () => get('/projects');
export const getProject = (id) => get(`/projects/${id}`);
export const getMyProjects = () => get('/projects/my/projects');
export const createProject = (projectData) => post('/projects', projectData);

// Users
export const getFreelancers = () => get('/users/freelancers');
export const getFreelancer = (id) => get(`/users/${id}`);

// Proposals & Squads
export const getProjectProposals = (projectId) => get(`/proposals/project/${projectId}`);
export const getMyProposals = () => get('/proposals/my');
export const getInvites = () => get('/squads/invites');
export const acceptInvite = (squadId) => post(`/squads/${squadId}/accept`, {});
export const rejectInvite = (squadId) => post(`/squads/${squadId}/reject`, {});
export const submitSquadProposal = (proposalData) => post('/proposals/squad', proposalData);
export const submitProposal = (proposalData) => post('/proposals', proposalData);

// Sentiment Analysis
export const analyzeReview = async (reviewData) => {
    const response = await post('/reviews/analyze', reviewData);
    return response.data;
};

export const getReviews = async (freelancerId) => {
    const url = freelancerId ? `/reviews?freelancerId=${freelancerId}` : '/reviews';
    const response = await get(url);
    return response.data;
};

export const healthCheck = async () => {
    const response = await get('/health');
    return response.data;
};

export default {
    login,
    register,
    getProjects,
    getProject,
    getMyProjects,
    createProject,
    getFreelancers,
    getFreelancer,
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
