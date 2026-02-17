import axiosClient from './axiosClient';

const bookingApi = {
  createBooking: (bookingData) => {
    // bookingData = { busId, passengerDetails, seatNumbers }
    return axiosClient.post('/bookings', bookingData);
  },

 getMyBookings: () => {
    // The backend gets the User ID automatically from the "Bearer Token"
    return axiosClient.get('/bookings/my-bookings'); 
  },
  
  getBookingById: (bookingId) => {
    return axiosClient.get(`/bookings/${bookingId}`);
  }
};

export default bookingApi;