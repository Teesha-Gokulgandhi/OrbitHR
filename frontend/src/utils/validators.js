export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  password: (password) => {
    return password.length >= 8;
  },

  employeeId: (id) => {
    return id && id.length >= 3;
  },

  phone: (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
  },

  required: (value) => {
    return value !== undefined && value !== null && value !== '';
  },
};