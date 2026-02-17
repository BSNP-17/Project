import axiosClient from './axiosClient';

const busApi = {
  searchBuses: (from, to, date) => {
    // Calls: /api/buses/search?from=Bangalore&to=Goa&date=2025-02-10
    return axiosClient.get(`/buses/search?from=${from}&to=${to}&date=${date}`);
  },

  getBusById: (busId) => {
    return axiosClient.get(`/buses/${busId}`);
  },
  
  getAllBuses: () => {
    return axiosClient.get('/buses');
  }
};

export default busApi;