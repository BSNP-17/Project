import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingApi from '../api/bookingApi'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import './MyBooking.css'; // Matches your uploaded filename

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // 1. Fetch from Backend
        const response = await bookingApi.getMyBookings();
        
        // 2. Sort: Newest First
        const sortedBookings = response.data.sort((a, b) => 
          new Date(b.bookingTime) - new Date(a.bookingTime)
        );
        
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="my-bookings-page">
        <div className="container">
          <h1 className="page-title">My Bookings 🎟️</h1>

          {bookings.length === 0 ? (
            <div className="no-bookings" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h3>No bookings found</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>You haven't booked any trips yet.</p>
              <button 
                className="view-btn" 
                style={{ background: '#ff6b35', color: 'white', border: 'none' }}
                onClick={() => navigate('/home')}
              >
                Book a Trip
              </button>
            </div>
          ) : (
            <div className="bookings-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card glass-panel" style={{ padding: '25px', background: 'white', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  
                  {/* Column 1: Bus Info & Status */}
                  <div className="bus-info" style={{ flex: '1 1 250px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '1.2rem' }}>
                      {booking.busName || "TravelEase Bus Service"}
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className={`status-badge ${booking.status?.toLowerCase() || 'confirmed'}`}>
                        {booking.status || "CONFIRMED"}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        PNR: <strong>{booking.bookingId}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Route & Date */}
                  <div className="route-info" style={{ flex: '1 1 250px', textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#333', marginBottom: '5px' }}>
                      {/* Note: If your backend doesn't send source/dest, we show generics or you can update backend */}
                      {booking.source || "Source"} <span style={{ color: '#ff6b35' }}>➝</span> {booking.destination || "Destination"}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                      {booking.bookingTime ? new Date(booking.bookingTime).toLocaleDateString() : "Date N/A"}
                      <span style={{ margin: '0 8px' }}>•</span>
                      {booking.bookingTime ? new Date(booking.bookingTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#10b981', marginTop: '6px', fontWeight: '600' }}>
                      Seats: {booking.seatNumbers ? booking.seatNumbers.join(', ') : 'Unassigned'}
                    </div>
                  </div>

                  {/* Column 3: Price & Actions */}
                  <div className="action-col" style={{ flex: '0 0 auto', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2c3e50' }}>
                      ₹{booking.totalAmount}
                    </div>
                    <button 
                      className="view-btn" 
                      onClick={() => navigate(`/booking-success/${booking.bookingId}`)}
                      style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      View Ticket
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyBookings;