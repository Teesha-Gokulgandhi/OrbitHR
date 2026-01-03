import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@config/apiConfig';

export const attendanceService = {
  // Check in
  checkIn: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN);
    return response.data;
  },

  // Check out
  checkOut: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.CHECK_OUT);
    return response.data;
  },

  // Get my attendance
  getMyAttendance: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ATTENDANCE.ME, { params });
    return response.data;
  },

  // Get attendance report
  getReport: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ATTENDANCE.REPORT, { params });
    return response.data;
  },

  // Mark attendance manually
  markAttendance: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE.MARK, data);
    return response.data;
  },

  // Get attendance by user
  getByUser: async (userId, params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ATTENDANCE.BY_USER(userId), { params });
    return response.data;
  },
};