import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingApi from '../api/bookingApi'; 
import paymentApi from '../api/paymentApi'; 
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
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form States
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  useEffect(() => {
    // Pull booking details (like amount and bus ID) from local storage
    const storedData = JSON.parse(localStorage.getItem('currentBooking'));
    if (!storedData) {
      alert("Booking session expired!");
      navigate('/home');
    } else {
      setBooking(storedData);
      setLoading(false);
    }
  }, [bookingId, navigate]);

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
      // 🚀 BYPASS: If this is a Mock Bus, skip the backend and simulate success!
      if (booking?.busId && booking.busId.startsWith('mock-')) {
        await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate bank delay
        
        setProcessing(false);
        setPaymentSuccess(true);
        
        setTimeout(() => {
          navigate(`/booking-success/${bookingId}`);
        }, 1500);
        return; // Stop here so it doesn't crash on the backend
      }

      // 2. ✅ REAL DATA: Call the Real Backend API
      await paymentApi.processPayment({
        bookingId: bookingId,
        amount: booking.totalAmount,
        paymentMethod: paymentMethod
      });
      
      setProcessing(false);
      setPaymentSuccess(true);
      
      setTimeout(() => {
        navigate(`/booking-success/${bookingId}`);
      }, 1500);

    } catch (error) {
      console.error("Payment Failed", error);
      alert("Payment failed! Please try again or check your booking status.");
      setProcessing(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <Navbar />
      
      {/* REALISTIC BANK PROCESSING MODAL */}
      {processing && (
        <div className="bank-modal-overlay">
          <div className="bank-modal">
            <div className="bank-loader"></div>
            <h3>Connecting to Secure Server...</h3>
            <p>Please do not press back or refresh the page.</p>
            <div className="secure-badge">🔒 Bank Grade Encryption</div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {paymentSuccess && (
        <div className="bank-modal-overlay">
          <div className="bank-modal" style={{border: '2px solid #10b981'}}>
            <div style={{fontSize: '4rem', marginBottom:'10px'}}>✅</div>
            <h3 style={{color: '#10b981'}}>Payment Successful!</h3>
            <p>Generating your ticket...</p>
          </div>
        </div>
      )}

      <div className="payment-page-container">
        <div className="payment-card-layout">
          
          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            <div className={`method-item ${paymentMethod === 'upi' ? 'active' : ''}`} onClick={() => setPaymentMethod('upi')}>
              <span className="icon">📱</span> 
              <div className="text"><h4>UPI</h4><p>Google Pay, PhonePe, Paytm</p></div>
            </div>
            <div className={`method-item ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
              <span className="icon">💳</span> 
              <div className="text"><h4>Credit / Debit Card</h4><p>Visa, Mastercard, Rupay</p></div>
            </div>
          </div>

          <div className="payment-summary-box">
            <h3>Payment Details</h3>
            <div className="summary-row">
               <span>Total Fare</span>
               <span>₹{booking?.totalAmount}</span>
            </div>
            <div className="total-row">
               <span>Total to Pay</span>
               <span>₹{booking?.totalAmount}</span>
            </div>

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
                  <div className="pay-input-row" style={{display:'flex', gap:'10px'}}>
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

            <button className="pay-now-btn" onClick={handlePayment} disabled={processing || paymentSuccess}>
              PAY ₹{booking?.totalAmount}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;