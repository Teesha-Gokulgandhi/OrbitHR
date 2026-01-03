import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@config/apiConfig';

export const documentService = {
  // Upload document
  upload: async (formData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.DOCUMENTS.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get my documents
  getMyDocuments: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DOCUMENTS.ME);
    return response.data;
  },

  // Get employee documents
  getEmployeeDocuments: async (userId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DOCUMENTS.BY_USER(userId));
    return response.data;
  },

  // Download document
  download: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id), {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete document
  delete: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
    return response.data;
  },
};