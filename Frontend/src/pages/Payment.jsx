import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingApi from '../api/bookingApi'; 
import paymentApi from '../api/paymentApi'; // ✅ Import Payment API
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import './Payment.css'; 

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  // Form States
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingApi.getBookingById(bookingId);
        setBooking(response.data);
      } catch (error) {
        console.error("Fetch Error", error);
        alert("Could not fetch booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    // 1. Basic Validation
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      alert("Please enter a valid UPI ID (e.g., user@oksbi)");
      return;
    }
    if (paymentMethod === 'card' && cardDetails.number.length < 16) {
      alert("Please enter a valid 16-digit Card Number");
      return;
    }

    setProcessing(true);

    try {
      // 2. ✅ Call the Real Backend API
      await paymentApi.processPayment({
        bookingId, // This is the PNR passed from the URL
        amount: booking.totalAmount,
        paymentMethod
      });
      
      alert("Payment Successful! 🎉 Ticket Confirmed.");
      navigate('/my-bookings'); 
      
    } catch (error) {
      console.error("Payment Failed", error);
      alert("Payment failed. Please try again or check your booking status.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="payment-page-container">
        
        <div className="payment-card-layout">
          {/* Left: Payment Options */}
          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            
            <div 
              className={`method-item ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <span className="icon">📱</span> 
              <div className="text">
                <h4>UPI</h4>
                <p>Google Pay, PhonePe, Paytm</p>
              </div>
            </div>

            <div 
              className={`method-item ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <span className="icon">💳</span> 
              <div className="text">
                <h4>Credit / Debit Card</h4>
                <p>Visa, Mastercard, Rupay</p>
              </div>
            </div>

            <div 
              className={`method-item ${paymentMethod === 'netbanking' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              <span className="icon">🏦</span> 
              <div className="text">
                <h4>Net Banking</h4>
                <p>All Indian Banks</p>
              </div>
            </div>
          </div>

          {/* Right: Payment Details */}
          <div className="payment-summary-box">
            <h3>Payment Details</h3>
            <div className="summary-row">
               <span>Total Fare</span>
               <span>₹{booking?.totalAmount}</span>
            </div>
            <div className="summary-row green">
               <span>Discount</span>
               <span>- ₹0</span>
            </div>
            <div className="divider"></div>
            <div className="total-row">
               <span>Total to Pay</span>
               <span>₹{booking?.totalAmount}</span>
            </div>

            {/* Dynamic Form based on Selection */}
            <div className="payment-form">
               {paymentMethod === 'upi' && (
                 <input 
                   type="text" 
                   placeholder="Enter UPI ID (e.g. user@oksbi)" 
                   className="pay-input"
                   value={upiId}
                   onChange={(e) => setUpiId(e.target.value)}
                 />
               )}
               {paymentMethod === 'card' && (
                 <>
                  <input 
                    type="text" 
                    placeholder="Card Number (16 digits)" 
                    maxLength="16"
                    className="pay-input" 
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                  <div className="row">
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="pay-input"
                      maxLength="5"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} 
                    />
                    <input 
                      type="password" 
                      placeholder="CVV" 
                      className="pay-input" 
                      maxLength="3"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    />
                  </div>
                 </>
               )}
            </div>

            <button 
              className="pay-now-btn" 
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? "Processing..." : `PAY ₹${booking?.totalAmount}`}
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;