import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusCard.css';

const BusCard = ({ bus }) => {
  const navigate = useNavigate();
  const [showSeats, setShowSeats] = useState(false);

  // Calculate Duration (Simple version)
  const getDuration = (start, end) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diffMs = e - s;
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.round(((diffMs % 3600000) / 60000));
    return `${hours}h ${minutes}m`;
  };

  // Format Time (e.g., "10:30 PM")
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: 'numeric', minute: '2-digit', hour12: true 
    });
  };

  return (
    <div className="bus-card">
      <div className="card-main">
        {/* 1. Operator Info */}
        <div className="bus-info-col">
          <h3 className="operator-name">{bus.operator}</h3>
          <p className="bus-type">{bus.busType}</p>
          <div className="rating-badge">
            ⭐ 4.5 <span className="rating-count">(124 ratings)</span>
          </div>
        </div>

        {/* 2. Schedule Info */}
        <div className="schedule-col">
          <div className="time-group">
            <span className="time-text">{formatTime(bus.departureTime)}</span>
            <span className="city-text">{bus.fromCity}</span>
          </div>
          
          <div className="duration-group">
            <span className="duration-text">{getDuration(bus.departureTime, bus.arrivalTime)}</span>
            <div className="duration-line"></div>
          </div>

          <div className="time-group">
            <span className="time-text">{formatTime(bus.arrivalTime)}</span>
            <span className="city-text">{bus.toCity}</span>
          </div>
        </div>

        {/* 3. Price & Action */}
        <div className="price-col">
          <div className="price-tag">
            <span className="currency">₹</span>
            {bus.price}
          </div>
          <p className="seats-left">{bus.availableSeats} Seats available</p>
          <button 
            className="view-seats-btn"
            onClick={() => navigate(`/book/${bus.id}`)}
          >
            VIEW SEATS
          </button>
        </div>
      </div>
      
      {/* Amenities Strip */}
      <div className="amenities-strip">
        {bus.amenities && bus.amenities.map((item, i) => (
          <span key={i} className="amenity-item">✓ {item}</span>
        ))}
      </div>
    </div>
  );
};

export default BusCard;