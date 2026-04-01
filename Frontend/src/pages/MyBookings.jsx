import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        // Calls the @GetMapping("/my-bookings") in your Spring Boot BookingController
        const response = await axiosClient.get('/bookings/my-bookings');
        
        // Sort bookings so the newest ones appear at the top
        const sortedBookings = response.data.sort((a, b) => 
          new Date(b.bookingTime) - new Date(a.bookingTime)
        );
        
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  // Helper to format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="bookings-container">
        <h2 className="page-title">My Trips 🎫</h2>
        <p className="page-subtitle">Manage all your upcoming and past bus journeys here.</p>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No trips found</h3>
            <p>Looks like you haven't booked any buses yet!</p>
            <Button text="Explore Routes" variant="primary" onClick={() => navigate('/home')} />
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((ticket) => (
              <div key={ticket.id} className="booking-card">
                
                <div className="booking-header">
                  <div className="status-badge" data-status={ticket.status}>
                    {ticket.status}
                  </div>
                  <div className="pnr-info">
                    <span>PNR:</span> <strong>{ticket.bookingId}</strong>
                  </div>
                </div>

                <div className="booking-body">
                  <div className="route-details">
                    {/* Maps to 'source' and 'destination' from BookingResponse.java */}
                    <h3>{ticket.source} → {ticket.destination}</h3>
                    <p className="bus-name">{ticket.busName} • {ticket.busType}</p>
                  </div>
                  
                  <div className="time-details">
                    <div className="time-block">
                      <span className="label">Departure</span>
                      <span className="value">{formatDate(ticket.departureTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="seat-details">
                    <span className="label">Seats:</span>
                    <span className="seats-list">{ticket.seatNumbers?.join(', ')}</span>
                  </div>
                  <div className="price-details">
                    <span className="label">Total Paid:</span>
                    <span className="price">₹{ticket.totalAmount}</span>
                  </div>
                  
                  {/* Let users view their boarding pass again! */}
                  <button 
                    className="view-ticket-btn"
                    onClick={() => navigate(`/booking-success/${ticket.bookingId}`)}
                  >
                    View E-Ticket
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;