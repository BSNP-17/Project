import axiosClient from './axiosClient.js';

const authApi = {
  register: (data) => {
    // data = { fullname, email, password }
    return axiosClient.post('/auth/signup', data);
  },

  login: (data) => {
    // data = { email, password }
    return axiosClient.post('/auth/login', data);
  },

  getCurrentUser: () => {
    return axiosClient.get('/users/me');
  },

  // Forgot Password — Step 1: verify email exists
  verifyEmailExists: (email) => {
    return axiosClient.get('/auth/check-email', { params: { email } });
  },

  // Forgot Password — Step 2: reset password
  resetPassword: (data) => {
    // data = { email, newPassword }
    return axiosClient.put('/auth/reset-password', data);
  },
};

export default authApi;
