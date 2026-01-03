export const calculations = {
  calculateNetSalary: (basic, allowances = {}, deductions = {}) => {
    const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + (val || 0), 0);
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
    const gross = basic + totalAllowances;
    const net = gross - totalDeductions;
    
    return {
      gross,
      totalAllowances,
      totalDeductions,
      net,
    };
  },

  calculateAttendancePercentage: (present, total) => {
    if (total === 0) return 0;
    return ((present / total) * 100).toFixed(2);
  },

  calculateLeaveBalance: (allocated, taken) => {
    return Math.max(0, allocated - taken);
  },

  calculateWorkingDays: (startDate, endDate, excludeWeekends = true) => {
    let count = 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    while (start <= end) {
      const dayOfWeek = start.getDay();
      if (!excludeWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
        count++;
      }
      start.setDate(start.getDate() + 1);
    }
    
    return count;
  },
};