import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@config/apiConfig';

export const payrollService = {
  // Create payroll
  create: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYROLL.BASE, data);
    return response.data;
  },

  // Get all payrolls
  getAll: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYROLL.BASE, { params });
    return response.data;
  },

  // Get my payroll
  getMyPayroll: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYROLL.ME, { params });
    return response.data;
  },

  // Get payroll by user
  getByUser: async (userId, params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYROLL.BY_USER(userId), { params });
    return response.data;
  },

  // Update payroll
  update: async (id, data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.PAYROLL.BY_ID(id), data);
    return response.data;
  },

  // Delete payroll
  delete: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.PAYROLL.BY_ID(id));
    return response.data;
  },

  // Generate payslip
  generatePayslip: async (id) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYROLL.PAYSLIP(id));
    return response.data;
  },
};
