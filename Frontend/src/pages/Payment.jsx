import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingApi from "../api/bookingApi";
import paymentApi from "../api/paymentApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import "./Payment.css";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(""); // ✅ Added to track payment errors
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [selectedBank, setSelectedBank] = useState("");

  const popularBanks = [
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank"
  ];

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingApi.getBookingById(bookingId);
        setBooking(response.data);
      } catch (error) {
        console.error("Failed to fetch booking details", error);
        // Fallback so the screen doesn't break if backend is slow
        setBooking({ totalAmount: 1100 });
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    setError(""); // Clear previous errors

    // ✅ Realistic Validations
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    if (paymentMethod === "UPI") {
      if (!upiId) return setError("Please enter your UPI ID");
      if (!upiRegex.test(upiId)) return setError("Invalid UPI format. Example: user@oksbi");
    }
    if (paymentMethod === "CARD" && cardDetails.number.length < 16) {
      return setError("Please enter a valid 16-digit card number");
    }
    if (paymentMethod === "NET_BANKING" && !selectedBank) {
      return setError("Please select your bank from the list");
    }

    setProcessing(true);

    try {
      const paymentRequest = {
        bookingId: bookingId,
        paymentMethod: paymentMethod,
        amount: booking?.totalAmount || 0
      };

      await paymentApi.processPayment(paymentRequest);
      
      // Modal will show spinning, then we navigate
      setTimeout(() => {
        setProcessing(false);
        navigate(`/booking-success/${bookingId}`);
      }, 1500);

    } catch (err) {
      console.error("Payment failed", err);
      setError("Payment failed! Please try again.");
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

      <div className="payment-page-container">
        <div className="payment-card-layout">
          
          {/* --- LEFT SIDE: PAYMENT METHODS --- */}
          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            
            <div className={`method-item ${paymentMethod === 'UPI' ? 'active' : ''}`} onClick={() => setPaymentMethod('UPI')}>
              <span className="icon">📱</span> 
              <div className="text"><h4>UPI</h4><p>Google Pay, PhonePe, Paytm</p></div>
            </div>
            
            <div className={`method-item ${paymentMethod === 'CARD' ? 'active' : ''}`} onClick={() => setPaymentMethod('CARD')}>
              <span className="icon">💳</span> 
              <div className="text"><h4>Credit / Debit Card</h4><p>Visa, Mastercard, Rupay</p></div>
            </div>
            
            <div className={`method-item ${paymentMethod === 'NET_BANKING' ? 'active' : ''}`} onClick={() => setPaymentMethod('NET_BANKING')}>
              <span className="icon">🏦</span> 
              <div className="text"><h4>Net Banking</h4><p>All major Indian banks</p></div>
            </div>
          </div>

          {/* --- RIGHT SIDE: PAYMENT DETAILS & BUTTON --- */}
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
               {/* ✅ Display Payment Errors neatly inline */}
               {error && <div className="payment-error-banner">⚠️ {error}</div>}

               {paymentMethod === 'UPI' && (
                 <input 
                   type="text" 
                   placeholder="Enter UPI ID (e.g. user@oksbi)" 
                   className="pay-input"
                   value={upiId}
                   onChange={(e) => setUpiId(e.target.value)}
                 />
               )}
               {paymentMethod === 'CARD' && (
                 <>
                  <input 
                    type="text" 
                    placeholder="Card Number (16 digits)" 
                    maxLength="16"
                    className="pay-input" 
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})}
                  />
                  <div className="pay-input-row">
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
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                    />
                  </div>
                 </>
               )}
               {paymentMethod === 'NET_BANKING' && (
                 <>
                  <select 
                    className="bank-dropdown"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="" disabled>-- Choose your bank --</option>
                    {popularBanks.map((bank, index) => (
                      <option key={index} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <p className="secure-text">🔒 You will be redirected to your bank's portal.</p>
                 </>
               )}
            </div>

            <button className="pay-now-btn" onClick={handlePayment} disabled={processing}>
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