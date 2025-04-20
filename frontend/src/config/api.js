/**
 * @file api.js
 * @description API configuration and axios instance setup
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 */

import axios from 'axios';

// Create axios instance with custom config
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const endpoints = {
    auth: {
        login: '/login/',
        signup: '/signup/',
        checkEmail: '/check-email/',
        profile: '/profile/',
        updateProfile: '/profile/update/',
        googleAuth: '/social-auth/google/',
        appleAuth: '/social-auth/apple/',
    },
    dashboard: '/dashboard/',
};

export default api; 