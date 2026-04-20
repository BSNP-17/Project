import axios from "axios";

const API_BASE = "http://localhost:8080/api/admin";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const adminApi = {
  // Dashboard Stats
  getStats: () => axios.get(`${API_BASE}/stats`, getAuthHeader()),

  // Bus Management
  getAllBuses: () => axios.get(`${API_BASE}/buses`, getAuthHeader()),
  addBus: (bus) => axios.post(`${API_BASE}/buses`, bus, getAuthHeader()),
  updateBus: (id, bus) => axios.put(`${API_BASE}/buses/${id}`, bus, getAuthHeader()),
  deleteBus: (id) => axios.delete(`${API_BASE}/buses/${id}`, getAuthHeader()),

  // Booking Management
  getAllBookings: () => axios.get(`${API_BASE}/all-bookings`, getAuthHeader()),
  cancelBooking: (id) => axios.delete(`${API_BASE}/bookings/${id}`, getAuthHeader()),

  // User Management
  getAllUsers: () => axios.get(`${API_BASE}/users`, getAuthHeader()),
  deleteUser: (id) => axios.delete(`${API_BASE}/users/${id}`, getAuthHeader()),
};

export default adminApi;
