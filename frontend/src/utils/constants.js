export const ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  ADMIN: 'admin',
};

export const LEAVE_TYPES = [
  { value: 'paid', label: 'Paid Leave', color: 'blue' },
  { value: 'sick', label: 'Sick Leave', color: 'red' },
  { value: 'unpaid', label: 'Unpaid Leave', color: 'gray' },
  { value: 'casual', label: 'Casual Leave', color: 'green' },
];

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  HALF_DAY: 'half-day',
  LEAVE: 'leave',
};

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Employee
  EMPLOYEE_DASHBOARD: '/employee/dashboard',
  EMPLOYEE_PROFILE: '/employee/profile',
  MY_ATTENDANCE: '/employee/attendance',
  MARK_ATTENDANCE: '/employee/attendance/mark',
  MY_LEAVES: '/employee/leaves',
  MY_PAYROLL: '/employee/payroll',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  EMPLOYEE_MANAGEMENT: '/admin/employees',
  ATTENDANCE_MANAGEMENT: '/admin/attendance',
  LEAVE_APPROVALS: '/admin/leaves',
  PAYROLL_MANAGEMENT: '/admin/payroll',
  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
};