import axiosClient from './axiosClient';

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
    return axiosClient.get('/users/me'); // Optional: If you have this endpoint
  }
};

export default authApi;