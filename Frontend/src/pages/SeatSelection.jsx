import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import busApi from '../api/busApi';
import bookingApi from '../api/bookingApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import './SeatSelection.css';

const SeatSelection = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        const response = await busApi.getBusById(busId);
        setBus(response.data);
      } catch (err) {
        console.error("Failed to load bus", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusDetails();
  }, [busId]);

  // Toggle Seat Selection
  const toggleSeat = (seatId, price) => {
    // If booked, do nothing
    if (bus?.bookedSeats?.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      // Unselect
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      setTotalPrice(prev => prev - price);
    } else {
      // Select (Max 6)
      if (selectedSeats.length >= 6) return alert("You can only book 6 seats max.");
      setSelectedSeats(prev => [...prev, seatId]);
      setTotalPrice(prev => prev + price);
    }
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) return alert('Select at least 1 seat');
    
    // Mock user check (replace with real auth check if needed)
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      alert("Please login first");
      navigate('/login');
      return;
    }

    try {
      // Call Backend to hold seats
      const bookingRequest = {
        busId: busId,
        passengerDetails: selectedSeats.map(() => userData.fullname || "Passenger"),
        seatNumbers: selectedSeats
      };
      
      const response = await bookingApi.createBooking(bookingRequest);
      
      // Update Context
      updateBooking({
        busId: busId,
        busDetails: { 
          name: bus.operator, 
          type: bus.busType, 
          departure: bus.departureTime 
        },
        selectedSeats: selectedSeats,
        totalAmount: response.data.totalAmount, 
        bookingId: response.data.bookingId
      });

      navigate(`/payment/${response.data.bookingId}`);

    } catch (err) {
      alert("Booking Failed: " + (err.response?.data || "Network Error"));
    }
  };

  // Helper to render a single seat
  const renderSeat = (seatNum, type = "seater", price) => {
    const isBooked = bus?.bookedSeats?.includes(seatNum);
    const isSelected = selectedSeats.includes(seatNum);
    
    return (
      <div 
        key={seatNum}
        className={`seat-item ${type} ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={() => toggleSeat(seatNum, price)}
        title={`Seat ${seatNum} | ₹${price}`}
      >
        <div className="seat-headrest"></div>
        <div className="seat-body">
          <span className="seat-num">{seatNum}</span>
        </div>
      </div>
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="seat-selection-container">
        
        {/* Left Side: Layout */}
        <div className="layout-section">
          <div className="bus-layout-header">
            <h2>Select Seats</h2>
            <div className="legend">
              <span className="badge available">Available</span>
              <span className="badge selected">Selected</span>
              <span className="badge booked">Booked</span>
            </div>
          </div>

          <div className="decks-container">
            {/* LOWER DECK */}
            <div className="deck">
              <h3>Lower Deck (Seater)</h3>
              <div className="steering-wheel">Let's Go ➔</div>
              <div className="seats-grid-2x2">
                 {/* Mocking Rows */}
                 {[1,2,3,4,5].map(row => (
                   <div key={row} className="seat-row">
                      {renderSeat(`L${row}A`, 'seater', bus.price)}
                      {renderSeat(`L${row}B`, 'seater', bus.price)}
                      <div className="aisle"></div>
                      {renderSeat(`L${row}C`, 'seater', bus.price)}
                      {renderSeat(`L${row}D`, 'seater', bus.price)}
                   </div>
                 ))}
              </div>
            </div>

            {/* UPPER DECK */}
            <div className="deck">
              <h3>Upper Deck (Sleeper)</h3>
              <div className="steering-wheel-placeholder"></div>
              <div className="seats-grid-sleeper">
                 {[1,2,3,4,5].map(row => (
                   <div key={row} className="seat-row">
                      {renderSeat(`U${row}A`, 'sleeper', bus.price + 200)}
                      <div className="aisle"></div>
                      {renderSeat(`U${row}B`, 'sleeper', bus.price + 200)}
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Price Summary */}
        <div className="summary-section">
          <div className="summary-card">
            <h3>Booking Summary</h3>
            <div className="trip-route">
              <strong>{bus.fromCity}</strong> ➔ <strong>{bus.toCity}</strong>
            </div>
            <div className="selected-seats-list">
              <p>Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
            </div>
            <div className="price-breakdown">
              <span>Base Fare</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="price-breakdown tax">
              <span>Tax (5%)</span>
              <span>₹{Math.round(totalPrice * 0.05)}</span>
            </div>
            <div className="total-pay">
              <span>Total Amount</span>
              <span>₹{Math.round(totalPrice * 1.05)}</span>
            </div>
            <button 
              className="proceed-btn" 
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
            >
              PROCEED TO PAY
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default SeatSelection;