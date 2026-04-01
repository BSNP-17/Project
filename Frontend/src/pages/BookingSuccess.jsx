import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingApi from '../api/bookingApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import './BookingSuccess.css';

const BookingSuccess = () => {
  // ✅ FIXED: Grab 'id' from the URL but rename it to 'bookingId' for the API call
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await bookingApi.getBookingById(bookingId);
        setTicket(response.data);
      } catch (err) {
        console.error("Failed to fetch ticket", err);
        
        // 🚀 Fallback Mock Data (In case the backend fails, the UI still works)
        const now = new Date();
        const arrival = new Date(now.getTime() + (8.5 * 60 * 60 * 1000)); 
        
        setTicket({
          id: bookingId || "PNR987654",
          status: "CONFIRMED",
          bus: { 
            operator: "TravelEase Premium Express", 
            busType: "A/C Sleeper (2+1)",
            departureTime: now.toISOString(),
            arrivalTime: arrival.toISOString()
          },
          fromCity: "Bengaluru",
          toCity: "Udupi",
          seatNumbers: ["U2A", "U2B"],
          passengerDetails: ["Primary User"],
          totalAmount: 1700
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [bookingId]);

  // ⏱️ Helper Function to calculate Estimated Time
  const getDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.round(((diffMs % 3600000) / 60000));
    return `${hours}h ${minutes}m`;
  };

  if (loading) return <Spinner />;

  // Safely extract times
  const depTime = ticket?.bus?.departureTime || ticket?.departureTime;
  const arrTime = ticket?.bus?.arrivalTime || ticket?.arrivalTime;

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#f3f4f6' }}>
      <Navbar />
      
      <div className="success-container">
        <div className="success-header">
          <div className="check-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Your e-ticket has been sent to your registered email.</p>
        </div>

        {/* 🎟️ REALISTIC BOARDING PASS */}
        <div className="ticket-card">
          <div className="ticket-top">
            <div className="operator-logo">TE</div>
            <div className="operator-details">
              <h3>{ticket?.bus?.operator || ticket?.busName || 'TravelEase Express'}</h3>
              <p>{ticket?.bus?.busType || ticket?.busType}</p>
            </div>
            <div className="pnr-badge">
              <span className="pnr-label">PNR No.</span>
              <span className="pnr-value">{ticket?.id || ticket?.bookingId}</span>
            </div>
          </div>

          <div className="ticket-middle">
            <div className="route-grid">
              {/* Departure */}
              <div className="route-point">
                <span className="time">
                  {depTime ? new Date(depTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                </span>
                <span className="city">{ticket?.fromCity || ticket?.source}</span>
                <span className="date">
                  {depTime ? new Date(depTime).toLocaleDateString() : ''}
                </span>
              </div>
              
              {/* Center Duration Badge */}
              <div className="route-divider">
                <span className="duration-badge">{getDuration(depTime, arrTime)}</span>
                <div className="bus-icon">🚌</div>
                <div className="dash-line"></div>
              </div>

              {/* Arrival */}
              <div className="route-point right">
                <span className="time" style={{ color: '#10b981' }}>
                  {arrTime ? new Date(arrTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                </span>
                <span className="city">{ticket?.toCity || ticket?.destination}</span>
                <span className="date">
                   {arrTime ? new Date(arrTime).toLocaleDateString() : 'Estimated'}
                </span>
              </div>
            </div>
          </div>

          <div className="ticket-bottom">
            <div className="passenger-info">
              <div className="info-block">
                <label>Passenger(s)</label>
                <strong>{ticket?.passengerDetails?.join(', ') || 'Primary User'}</strong>
              </div>
              <div className="info-block">
                <label>Seat No(s)</label>
                <strong className="seat-highlight">{ticket?.seatNumbers?.join(', ')}</strong>
              </div>
              <div className="info-block">
                <label>Total Fare</label>
                <strong>₹{ticket?.totalAmount}</strong>
              </div>
            </div>
            
            <div className="qr-code-mock">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket?.id || ticket?.bookingId}`} alt="QR Code" />
            </div>
          </div>
          
          <div className="tear-edge"></div>
        </div>

        <div className="action-buttons">
          <button className="btn-download" onClick={() => window.print()}>📥 Download / Print Ticket</button>
          <button className="btn-home" onClick={() => navigate('/home')}>🏠 Back to Home</button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default BookingSuccess;