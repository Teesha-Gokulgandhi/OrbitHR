import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@config/apiConfig';

export const employeeService = {
  // Get all employees
  getAll: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.BASE, { params });
    return response.data;
  },

  // Get employee stats
  getStats: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.STATS);
    return response.data;
  },

  // Get my profile
  getMyProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.ME);
    return response.data;
  },

  // Update my profile
  updateMyProfile: async (data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.EMPLOYEES.ME, data);
    return response.data;
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    return response.data;
  },

  // Update employee
  update: async (id, data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.EMPLOYEES.BY_ID(id), data);
    return response.data;
  },

  // Delete employee
  delete: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    return response.data;
  },
};