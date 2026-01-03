import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@config/apiConfig';

export const dashboardService = {
  // Get overview stats
  getOverview: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
    return response.data;
  },

  // Get employee stats
  getEmployeeStats: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.EMPLOYEES);
    return response.data;
  },

  // Get attendance stats
  getAttendanceStats: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.ATTENDANCE, { params });
    return response.data;
  },

  // Get leave stats
  getLeaveStats: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.LEAVES);
    return response.data;
  },

  // Get my dashboard
  getMyDashboard: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.ME);
    return response.data;
  },
};