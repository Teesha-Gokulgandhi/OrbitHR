import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@config/apiConfig';

export const departmentService = {
  // Create department
  create: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.DEPARTMENTS.BASE, data);
    return response.data;
  },

  // Get all departments
  getAll: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DEPARTMENTS.BASE);
    return response.data;
  },

  // Get department by ID
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return response.data;
  },

  // Update department
  update: async (id, data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.DEPARTMENTS.BY_ID(id), data);
    return response.data;
  },

  // Delete department
  delete: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return response.data;
  },

  // Get employees in department
  getEmployees: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DEPARTMENTS.EMPLOYEES(id));
    return response.data;
  },
};
