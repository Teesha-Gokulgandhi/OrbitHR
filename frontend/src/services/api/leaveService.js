import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@config/apiConfig';

export const leaveService = {
  // Create leave request
  create: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LEAVES.BASE, data);
    return response.data;
  },

  // Get all leave requests
  getAll: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.LEAVES.BASE, { params });
    return response.data;
  },

  // Get my leave requests
  getMyLeaves: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.LEAVES.ME, { params });
    return response.data;
  },

  // Get leave balance
  getBalance: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.LEAVES.BALANCE);
    return response.data;
  },

  // Get leave by ID
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.LEAVES.BY_ID(id));
    return response.data;
  },

  // Cancel leave
  cancel: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.LEAVES.BY_ID(id));
    return response.data;
  },

  // Approve leave
  approve: async (id, comments) => {
    const response = await axiosInstance.put(API_ENDPOINTS.LEAVES.APPROVE(id), { comments });
    return response.data;
  },

  // Reject leave
  reject: async (id, comments) => {
    const response = await axiosInstance.put(API_ENDPOINTS.LEAVES.REJECT(id), { comments });
    return response.data;
  },
};