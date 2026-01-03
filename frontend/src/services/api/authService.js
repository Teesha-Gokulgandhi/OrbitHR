import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@config/apiConfig';

export const authService = {
  // Sign up
  signup: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data;
  },

  // Sign in
  signin: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNIN, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};