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

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        
        // 🚀 BYPASS: If it's a mock bus from our fallback data
        if (busId.startsWith('mock-')) {
          setBus({
            id: busId, operator: "TravelEase Premium Express", busType: "A/C Sleeper (2+1)",
            fromCity: "Source", toCity: "Destination", price: 850,
            bookedSeats: ["L1A", "U2B", "L4C"], 
            departureTime: new Date().toISOString()
          });
          return;
        }

        // 🚀 REAL DATA: Fetch from Spring Boot
        const response = await busApi.getBusById(busId);
        setBus(response.data);
      } catch (err) {
        alert("Error fetching bus details from backend!");
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    fetchBusDetails();
  }, [busId, navigate]);

  const toggleSeat = (seatId) => {
    if (bus?.bookedSeats?.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 6) return alert("You can book a maximum of 6 seats.");
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) return alert('Select at least 1 seat');
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      alert("Please login first to book seats!");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      let finalBookingId = "";
      let finalTotalAmount = selectedSeats.length * (bus?.price || 850);

      // 🚀 BYPASS: Mock Booking creation for Mock Buses
      if (busId.startsWith('mock-')) {
        finalBookingId = "PNR" + Math.floor(Math.random() * 900000 + 100000); // Fake PNR
        await new Promise(r => setTimeout(r, 1000)); // Simulate delay
      } else {
        // 🚀 REAL DATA: Create a PENDING booking in Spring Boot
        const bookingRequest = {
          busId: busId,
          passengerDetails: selectedSeats.map(() => userData.fullname),
          seatNumbers: selectedSeats
        };
        const response = await bookingApi.createBooking(bookingRequest);
        finalBookingId = response.data.bookingId;
        finalTotalAmount = response.data.totalAmount;
      }
      
      // Save data for the Payment Page
      updateBooking({
        busId,
        busDetails: { name: bus.operator, type: bus.busType, departure: bus.departureTime },
        selectedSeats,
        totalAmount: finalTotalAmount,
        from: bus.fromCity, 
        to: bus.toCity
      });

      // Redirect to Payment
      navigate(`/payment/${finalBookingId}`);
    } catch (err) {
      alert("Booking Failed: " + (err.response?.data || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  const renderSeat = (seatNum, type) => (
    <div 
      key={seatNum}
      className={`seat-item ${type} ${bus?.bookedSeats?.includes(seatNum) ? 'booked' : ''} ${selectedSeats.includes(seatNum) ? 'selected' : ''}`}
      onClick={() => toggleSeat(seatNum)}
    >
      <div className="seat-headrest"></div>
      <div className="seat-body"><span className="seat-num">{seatNum}</span></div>
    </div>
  );

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="seat-selection-container">
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
            <div className="deck">
              <h3>Lower Deck</h3>
              <div className="steering-wheel">Driver</div>
              <div className="seats-grid-2x2">
                 {[1,2,3,4,5].map(row => (
                   <div key={row} className="seat-row">
                      {renderSeat(`L${row}A`, 'seater')}
                      {renderSeat(`L${row}B`, 'seater')}
                      <div className="aisle"></div>
                      {renderSeat(`L${row}C`, 'seater')}
                      {renderSeat(`L${row}D`, 'seater')}
                   </div>
                 ))}
              </div>
            </div>
            <div className="deck">
              <h3>Upper Deck (Sleeper)</h3>
              <div className="steering-wheel-placeholder" style={{marginBottom:'20px'}}></div>
              <div className="seats-grid-sleeper">
                 {[1,2,3,4,5].map(row => (
                   <div key={row} className="seat-row">
                      {renderSeat(`U${row}A`, 'sleeper')}
                      <div className="aisle"></div>
                      {renderSeat(`U${row}B`, 'sleeper')}
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <div className="summary-card">
            <h3>Booking Summary</h3>
            <div className="selected-seats-list">
              <p>Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
            </div>
            <div className="total-pay">
              <span>Total Amount</span>
              <span>₹{selectedSeats.length * (bus?.price || 0)}</span>
            </div>
            <button className="proceed-btn" onClick={handleProceed} disabled={selectedSeats.length === 0}>
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
