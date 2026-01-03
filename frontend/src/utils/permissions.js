export const permissions = {
  canViewAllEmployees: (user) => {
    return user?.role === 'admin' || user?.role === 'hr';
  },

  canEditEmployee: (user, employeeId) => {
    if (user?.role === 'admin' || user?.role === 'hr') return true;
    return user?.id === employeeId;
  },

  canApproveLeave: (user) => {
    return user?.role === 'admin' || user?.role === 'hr';
  },

  canManagePayroll: (user) => {
    return user?.role === 'admin' || user?.role === 'hr';
  },

  canViewReports: (user) => {
    return user?.role === 'admin' || user?.role === 'hr';
  },

  canManageSettings: (user) => {
    return user?.role === 'admin';
  },

  isEmployee: (user) => {
    return user?.role === 'employee';
  },

  isAdmin: (user) => {
    return user?.role === 'admin';
  },

  isHR: (user) => {
    return user?.role === 'hr';
  },
};
