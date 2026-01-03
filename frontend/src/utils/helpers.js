export const helpers = {
  getStatusColor: (status) => {
    const colors = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
      present: 'green',
      absent: 'red',
      'half-day': 'yellow',
      leave: 'blue',
      paid: 'blue',
      unpaid: 'gray',
    };
    return colors[status] || 'gray';
  },

  getStatusBadgeClass: (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      'half-day': 'bg-yellow-100 text-yellow-800',
      leave: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  },

  calculateWorkHours: (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return (diff / (1000 * 60 * 60)).toFixed(2);
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  handleError: (error) => {
    if (error.response) {
      return error.response.data.message || 'An error occurred';
    } else if (error.request) {
      return 'No response from server';
    } else {
      return error.message || 'An error occurred';
    }
  },
};