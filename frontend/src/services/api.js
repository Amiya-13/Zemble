import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const analyzeReview = async (reviewData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reviews/analyze`, reviewData);
        return response.data;
    } catch (error) {
        console.error('Error analyzing review:', error);
        throw error;
    }
};

export const getReviews = async (freelancerId) => {
    try {
        const url = freelancerId
            ? `${API_BASE_URL}/reviews?freelancerId=${freelancerId}`
            : `${API_BASE_URL}/reviews`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

export const healthCheck = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        return response.data;
    } catch (error) {
        console.error('Error checking API health:', error);
        throw error;
    }
};

export default {
    analyzeReview,
    getReviews,
    healthCheck,
};
