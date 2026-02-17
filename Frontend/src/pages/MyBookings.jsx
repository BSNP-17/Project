import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import './MyBooking.css'; // Importing the singular CSS file

const MyBookings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Simulate API fetch for bookings
    setTimeout(() => {
      setBookings([
        {
          id: 'BK123456',
          busName: 'IntrCity SmartBus',
          source: 'Delhi',
          destination: 'Manali',
          date: '2023-12-25',
          amount: 1250,
          status: 'CONFIRMED',
          seats: ['L1', 'L2']
        },
        {
          id: 'BK987654',
          busName: 'Zingbus',
          source: 'Manali',
          destination: 'Delhi',
          date: '2024-01-02',
          amount: 1100,
          status: 'COMPLETED',
          seats: ['R4']
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="my-bookings-page">
        <div className="container">
          <h1 className="page-title">My Bookings</h1>
          
          {bookings.length === 0 ? (
            <div className="no-bookings" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#666', marginBottom: '20px' }}>No bookings found.</p>
              <button onClick={() => navigate('/home')} className="btn-custom primary">Book a Bus</button>
            </div>
          ) : (
            <div className="bookings-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card glass-panel" style={{ padding: '20px', background: 'white', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  
                  <div className="bus-info">
                    <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{booking.busName}</h3>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>PNR: {booking.id}</div>
                  </div>
                  
                  <div className="route-info" style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#333' }}>
                      {booking.source} <span style={{ color: '#ff6b35' }}>➝</span> {booking.destination}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>{booking.date}</div>
                  </div>

                  <div className="action-col" style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2c3e50', marginBottom: '10px' }}>₹{booking.amount}</div>
                    <button className="view-btn" style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>View Ticket</button>
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