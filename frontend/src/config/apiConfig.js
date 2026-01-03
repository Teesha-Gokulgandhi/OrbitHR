export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    ME: '/auth/me',
  },
  
  // Employees
  EMPLOYEES: {
    BASE: '/employees',
    STATS: '/employees/stats',
    ME: '/employees/me',
    BY_ID: (id) => `/employees/${id}`,
  },
  
  // Attendance
  ATTENDANCE: {
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    ME: '/attendance/me',
    REPORT: '/attendance/report',
    MARK: '/attendance/mark',
    BY_USER: (userId) => `/attendance/${userId}`,
  },
  
  // Leaves
  LEAVES: {
    BASE: '/leaves',
    ME: '/leaves/me',
    BALANCE: '/leaves/balance',
    BY_ID: (id) => `/leaves/${id}`,
    APPROVE: (id) => `/leaves/${id}/approve`,
    REJECT: (id) => `/leaves/${id}/reject`,
  },
  
  // Payroll
  PAYROLL: {
    BASE: '/payroll',
    ME: '/payroll/me',
    BY_USER: (userId) => `/payroll/user/${userId}`,
    BY_ID: (id) => `/payroll/${id}`,
    PAYSLIP: (id) => `/payroll/${id}/payslip`,
  },
  
  // Dashboard
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    EMPLOYEES: '/dashboard/employees',
    ATTENDANCE: '/dashboard/attendance',
    LEAVES: '/dashboard/leaves',
    ME: '/dashboard/me',
  },
  
  // Departments
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id) => `/departments/${id}`,
    EMPLOYEES: (id) => `/departments/${id}/employees`,
  },
  
  // Documents
  DOCUMENTS: {
    BASE: '/documents',
    ME: '/documents/me',
    BY_USER: (userId) => `/documents/user/${userId}`,
    DOWNLOAD: (id) => `/documents/${id}/download`,
    BY_ID: (id) => `/documents/${id}`,
  },
};