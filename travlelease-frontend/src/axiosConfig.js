import axios from "axios";

// Set your backend base URL here
axios.defaults.baseURL = "http://localhost:8081";

// Attach token automatically if present
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;