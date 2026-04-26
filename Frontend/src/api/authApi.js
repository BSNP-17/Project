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

  // ─── OTP Forgot Password ──────────────────────────────────────────────────

  // Step 1: Send OTP to email
  sendOtp: (email) => {
    return axiosClient.post('/auth/forgot-password/send-otp', { email });
  },

  // Step 2: Verify OTP
  verifyOtp: (data) => {
    // data = { email, otp }
    return axiosClient.post('/auth/forgot-password/verify-otp', data);
  },

  // Step 3: Reset password
  resetPasswordWithOtp: (data) => {
    // data = { email, newPassword }
    return axiosClient.put('/auth/forgot-password/reset', data);
  },

  // Legacy (kept for compatibility)
  verifyEmailExists: (email) => {
    return axiosClient.get('/auth/check-email', { params: { email } });
  },
  resetPassword: (data) => {
    return axiosClient.put('/auth/reset-password', data);
  },
};

export default authApi;
