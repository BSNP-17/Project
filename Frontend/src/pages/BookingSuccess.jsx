import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingApi from "../api/bookingApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import "./BookingSuccess.css";

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await bookingApi.getBookingById(bookingId);
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  const handleDownload = () => {
    alert("Ticket PDF downloading... 📥");
  };

  // Helper to format date/time
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="success-page-container">
        
        <div className="success-header">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1>Booking Confirmed! 🎉</h1>
          <p>We've sent the ticket to your email. Have a safe journey!</p>
        </div>

        {/* The Ticket Card */}
        <div className="ticket-card">
          <div className="ticket-header">
            <div className="brand">TravelEase</div>
            {/* ✅ FIXED: Use bookingId (PNR) */}
            <div className="pnr">PNR: {booking?.bookingId}</div>
          </div>
          
          <div className="ticket-body">
            <div className="ticket-route-row">
              <div className="city-info">
                <span className="label">FROM</span>
                {/* ✅ FIXED: Use 'source' */}
                <span className="city">{booking?.source}</span>
                <span className="time">{formatTime(booking?.departureTime)}</span>
              </div>
              <div className="route-arrow">
                ---------------- 🚌 ----------------
              </div>
              <div className="city-info right">
                <span className="label">TO</span>
                {/* ✅ FIXED: Use 'destination' */}
                <span className="city">{booking?.destination}</span>
                <span className="time">{formatTime(booking?.arrivalTime)}</span>
              </div>
            </div>

            <div className="ticket-details-grid">
              <div className="detail-item">
                <span className="label">Date</span>
                <span className="value">{formatDate(booking?.departureTime)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Bus Operator</span>
                <span className="value">{booking?.busName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Seat No(s)</span>
                {/* ✅ FIXED: Use 'seatNumbers' */}
                <span className="value highlight">
                  {booking?.seatNumbers?.join(", ") || "Unassigned"}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Total Fare</span>
                <span className="value price">₹{booking?.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="ticket-footer">
            <div className="barcode">||| ||||| || |||| |||||| |||</div>
            <span className="powered-by">Powered by TravelEase</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleDownload}>
            Download Ticket ⬇️
          </button>
          <button className="btn-primary" onClick={() => navigate('/my-bookings')}>
            View My Bookings
          </button>
          <button className="btn-text" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default BookingSuccess;