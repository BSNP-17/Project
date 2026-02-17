import axiosClient from './axiosClient';

const paymentApi = {
  processPayment: (paymentData) => {
    // paymentData = { bookingId, amount, paymentMethod }
    return axiosClient.post('/payment/process', paymentData);
  }
};

export default paymentApi;