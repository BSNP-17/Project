import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './BusResults.css';

const BusResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('departure'); // NEW: Sorting

  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    
    if (from && to && date) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setBuses([
          {
            id: 1,
            operator: 'KSRTC Golden',
            operatorLogo: 'KSRTC',
            departure: '22:00',
            arrival: '05:30',
            duration: '7h 30m',
            type: 'Volvo AC Sleeper (2+1)',
            price: 850,
            seatsAvailable: 32,
            rating: 4.2,
            isAC: true,
            isSleeper: true,
            departureTime: new Date(`2026-01-25 ${'22:00'}`).getTime()
          },
          {
            id: 2,
            operator: 'VRL Travels',
            operatorLogo: 'VRL',
            departure: '23:15',
            arrival: '06:45',
            duration: '7h 30m',
            type: 'Semi Sleeper AC (2+2)',
            price: 720,
            seatsAvailable: 28,
            rating: 4.5,
            isAC: true,
            isSleeper: false,
            departureTime: new Date(`2026-01-25 ${'23:15'}`).getTime()
          },
          {
            id: 3,
            operator: 'SRS Travels',
            operatorLogo: 'SRS',
            departure: '21:45',
            arrival: '05:15',
            duration: '7h 30m',
            type: 'Non AC Sleeper (2+1)',
            price: 650,
            seatsAvailable: 18,
            rating: 4.0,
            isAC: false,
            isSleeper: true,
            departureTime: new Date(`2026-01-25 ${'21:45'}`).getTime()
          },
          {
            id: 4,
            operator: 'Sugama Tourist',
            operatorLogo: 'Sugama',
            departure: '22:30',
            arrival: '06:00',
            duration: '7h 30m',
            type: 'AC Seater (2+2)',
            price: 750,
            seatsAvailable: 24,
            rating: 4.3,
            isAC: true,
            isSleeper: false,
            departureTime: new Date(`2026-01-25 ${'22:30'}`).getTime()
          }
        ]);
        setLoading(false);
      }, 1200);
    }
  }, [searchParams]);

  // NEW: Sorting function
  const sortedBuses = [...buses].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.departureTime - b.departureTime;
  });

  // NEW: Seat selection navigation
  const selectBus = (bus) => {
    navigate(`/seat/${bus.id}?from=${searchParams.get('from')}&to=${searchParams.get('to')}&price=${bus.price}`);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Finding available buses from {searchParams.get('from')} to {searchParams.get('to')}...</p>
      </div>
    );
  }

  return (
    <div className="bus-results">
      {/* Enhanced Header */}
      <header className="results-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← New Search
          </button>
          <div className="search-summary">
            <h1>{sortedBuses.length} Buses Found</h1>
            <p>{searchParams.get('from')} → {searchParams.get('to')} • {searchParams.get('date')}</p>
          </div>
        </div>
        <div className="header-right">
          <span className="live-indicator">● Live Rates</span>
        </div>
      </header>

      {/* NEW: Filters & Sorting */}
      <div className="filters-bar">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="departure">Earliest Departure</option>
          <option value="price">Price: Low to High</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Bus List */}
      <div className="results-container">
        {sortedBuses.length === 0 ? (
          <div className="no-buses">
            <h3>No buses found</h3>
            <p>Try different route or date</p>
            <button onClick={() => navigate('/')}>New Search</button>
          </div>
        ) : (
          sortedBuses.map(bus => (
            <div key={bus.id} className="bus-card" onClick={() => selectBus(bus)}>
              <div className="bus-left">
                {/* NEW: Operator Logo */}
                <div className="operator-logo">{bus.operatorLogo}</div>
                
                <div className="operator-info">
                  <h3>{bus.operator}</h3>
                  <div className="bus-badges">
                    {bus.isAC && <span className="badge ac">AC</span>}
                    {bus.isSleeper && <span className="badge sleeper">Sleeper</span>}
                  </div>
                  <span className="bus-type">{bus.type}</span>
                </div>

                {/* Enhanced Timing */}
                <div className="bus-timing">
                  <div className="departure">
                    <div className="time big">{bus.departure}</div>
                    <div>Majestic</div>
                  </div>
                  <div className="route-line">
                    <div className="duration">{bus.duration}</div>
                  </div>
                  <div className="arrival">
                    <div className="time big">{bus.arrival}</div>
                    <div>KSRTC Bus Stand</div>
                  </div>
                </div>

                <div className="rating-section">
                  <span className="rating">⭐ {bus.rating}</span>
                  <span className="seats-available">{bus.seatsAvailable} Seats</span>
                </div>
              </div>

              <div className="bus-right">
                <div className="price-section">
                  <div className="price">₹{bus.price}</div>
                  <div className="per-person">/person</div>
                </div>
                <button className="select-seats-btn">
                  Select Seats
                  <span className="arrow">→</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BusResults;
