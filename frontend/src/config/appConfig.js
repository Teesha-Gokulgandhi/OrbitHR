export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Dayflow HRMS';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  ADMIN: 'admin',
};

export const LEAVE_TYPES = {
  PAID: 'paid',
  SICK: 'sick',
  UNPAID: 'unpaid',
  CASUAL: 'casual',
};

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

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  PAID: 'paid',
};
