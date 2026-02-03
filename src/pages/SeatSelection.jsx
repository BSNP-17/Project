import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './SeatSelection.css';

const SeatSelection = () => {
  const { busId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const price = parseInt(searchParams.get('price') || 0);
  
  // Bus data based on busId
  const busData = {
    1: { operator: 'KSRTC Golden', type: 'Volvo AC Sleeper (2+1)', price: 850 },
    2: { operator: 'VRL Travels', type: 'Semi Sleeper AC (2+2)', price: 720 },
    3: { operator: 'SRS Travels', type: 'Non AC Sleeper (2+1)', price: 650 },
    4: { operator: 'Sugama Tourist', type: 'AC Seater (2+2)', price: 750 }
  }[busId] || { operator: 'Unknown', type: 'AC Sleeper', price };

  // 32 seats layout (A1-A16, B1-B16)
  const allSeats = Array.from({ length: 32 }, (_, i) => {
    const letter = String.fromCharCode(65 + Math.floor(i / 16));
    const number = (i % 16) + 1;
    return `${letter}${number}`;
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats] = useState(['A5', 'A6', 'B3', 'B12', 'B15']); // Mock booked

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seat) 
        ? prev.filter(s => s !== seat)
        : [...prev, seat].slice(0, 4) // Max 4 seats
    );
  };

  const totalAmount = selectedSeats.length * price;
  const passengers = parseInt(searchParams.get('passengers')) || 1;

  const continueToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least 1 seat');
      return;
    }
    navigate(`/payment?seats=${selectedSeats.join(',')}&amount=${totalAmount}&from=${from}&to=${to}`);
  };

  return (
    <div className="seat-selection">
      {/* Header */}
      <header className="selection-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Buses
        </button>
        <div className="bus-info">
          <h1>{busData.operator}</h1>
          <p>{busData.type} | {price} × {selectedSeats.length} seats</p>
          <div className="route-info">
            {from} → {to}
          </div>
        </div>
      </header>

      {/* Seat Legend */}
      <div className="seat-legend">
        <span className="legend-item available">🟢 Available</span>
        <span className="legend-item selected">🟡 Selected</span>
        <span className="legend-item booked">🔴 Booked</span>
      </div>

      {/* Seat Layout */}
      <div className="seat-layout">
        <div className="seats-grid">
          {allSeats.map((seat, index) => (
            <button
              key={seat}
              className={`seat ${
                bookedSeats.includes(seat) ? 'booked' :
                selectedSeats.includes(seat) ? 'selected' : 'available'
              }`}
              onClick={() => toggleSeat(seat)}
              disabled={bookedSeats.includes(seat)}
            >
              {seat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="selection-summary">
        <div className="seats-summary">
          <h3>Selected Seats: <span>{selectedSeats.join(', ')}</span></h3>
          <p>{selectedSeats.length} seats × ₹{price} = <strong>₹{totalAmount}</strong></p>
        </div>
        
        <button 
          className="continue-btn"
          onClick={continueToPayment}
          disabled={selectedSeats.length === 0}
        >
          Continue to Payment ₹{totalAmount}
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
