import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useSearchParamsSync from '../hooks/useSearchParamsSync';
import busApi from '../api/busApi';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import './BusResults.css';

const BusResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { params } = useSearchParamsSync();
  
  const [allBuses, setAllBuses] = useState([]); // Store ALL fetched buses
  const [filteredBuses, setFilteredBuses] = useState([]); // Store displayed buses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('price');

  // --- FILTER STATES ---
  const [filters, setFilters] = useState({
    busTypes: [],       // ["AC Sleeper", "Non-AC", etc.]
    departureTimes: [], // ["before6am", "6amto12pm", etc.]
    amenities: []       // ["WiFi", "Blanket", etc.]
  });

  // 1. Fetch Data
  useEffect(() => {
    const fetchBuses = async () => {
      const from = params.from || searchParams.get('from');
      const to = params.to || searchParams.get('to');
      const date = params.date || searchParams.get('date');

      if (!from || !to || !date) return;

      try {
        setLoading(true);
        const response = await busApi.searchBuses(from, to, date);
        setAllBuses(response.data);
        setFilteredBuses(response.data); // Initially, show all
      } catch (err) {
        console.error("Search Error:", err);
        setError("Could not find buses. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [params, searchParams]);

  // 2. Handle Filter Logic
  useEffect(() => {
    let result = [...allBuses];

    // Filter by Bus Type
    if (filters.busTypes.length > 0) {
      result = result.filter(bus => {
        const type = bus.busType || "";
        // Mapping logic for checkboxes
        const isACSleeper = type.includes("AC") && type.includes("Sleeper");
        const isACSeater = type.includes("AC") && !type.includes("Sleeper");
        const isNonAC = type.includes("Non-AC");
        const isVolvo = type.includes("Volvo");

        // Check if ANY of the selected checkboxes match this bus
        return (
          (filters.busTypes.includes("AC Sleeper") && isACSleeper) ||
          (filters.busTypes.includes("AC Seater") && isACSeater) ||
          (filters.busTypes.includes("Non-AC") && isNonAC) ||
          (filters.busTypes.includes("Volvo") && isVolvo)
        );
      });
    }

    // Filter by Departure Time
    if (filters.departureTimes.length > 0) {
      result = result.filter(bus => {
        const hour = new Date(bus.departureTime).getHours();
        return (
          (filters.departureTimes.includes("before6am") && hour < 6) ||
          (filters.departureTimes.includes("6amto12pm") && hour >= 6 && hour < 12) ||
          (filters.departureTimes.includes("12pmto6pm") && hour >= 12 && hour < 18) ||
          (filters.departureTimes.includes("after6pm") && hour >= 18)
        );
      });
    }

    // Filter by Amenities
    if (filters.amenities.length > 0) {
      result = result.filter(bus => {
        // Bus must have ALL selected amenities
        return filters.amenities.every(amenity => bus.amenities && bus.amenities.includes(amenity));
      });
    }

    // 3. Apply Sorting
    result.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'duration') {
         const durA = new Date(a.arrivalTime) - new Date(a.departureTime);
         const durB = new Date(b.arrivalTime) - new Date(b.departureTime);
         return durA - durB;
      }
      // Default: Departure Time
      return new Date(a.departureTime) - new Date(b.departureTime);
    });

    setFilteredBuses(result);

  }, [filters, sortBy, allBuses]);

  // --- Toggle Handler ---
  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const currentList = prev[category];
      if (currentList.includes(value)) {
        // Remove if already exists
        return { ...prev, [category]: currentList.filter(item => item !== value) };
      } else {
        // Add if not exists
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };

  // --- Helpers ---
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = (endTime - startTime) / (1000 * 60);
    const hours = Math.floor(diff / 60);
    const mins = Math.floor(diff % 60);
    return `${hours}h ${mins}m`;
  };

  if (loading) return <Spinner />;

  return (
    <div className="bus-results-page">
      <Navbar />

      <div className="results-body">
        
        {/* --- 1. FILTERS SIDEBAR --- */}
        <aside className="filters-sidebar">
          
          <div className="filter-group">
            <div className="filter-title">Bus Type</div>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("busTypes", "AC Sleeper")} /> AC Sleeper
            </label>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("busTypes", "AC Seater")} /> AC Seater
            </label>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("busTypes", "Non-AC")} /> Non-AC
            </label>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("busTypes", "Volvo")} /> Volvo
            </label>
          </div>

          <div className="filter-group">
            <div className="filter-title">Departure Time</div>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("departureTimes", "before6am")} /> Before 6 AM
            </label>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("departureTimes", "6amto12pm")} /> 6 AM - 12 PM
            </label>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("departureTimes", "12pmto6pm")} /> 12 PM - 6 PM
            </label>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("departureTimes", "after6pm")} /> After 6 PM
            </label>
          </div>

          <div className="filter-group">
            <div className="filter-title">Amenities</div>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("amenities", "WiFi")} /> WiFi
            </label>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("amenities", "Charging Point")} /> Charging Point
            </label>
            <label className="filter-option">
              <input type="checkbox" onChange={() => handleFilterChange("amenities", "Blanket")} /> Blanket
            </label>
          </div>
        </aside>

        {/* --- 2. MAIN RESULTS LIST --- */}
        <main className="results-list">
          
          <div className="results-header-bar">
            <div className="results-count">
              {filteredBuses.length} Buses found for <span style={{color:'#ff6b35'}}>{params.from} → {params.to}</span>
            </div>
            <div className="sort-options">
              <button 
                className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
                onClick={() => setSortBy('price')}
              >
                Cheapest
              </button>
              <button 
                className={`sort-btn ${sortBy === 'duration' ? 'active' : ''}`}
                onClick={() => setSortBy('duration')}
              >
                Fastest
              </button>
              <button 
                className={`sort-btn ${sortBy === 'departure' ? 'active' : ''}`}
                onClick={() => setSortBy('departure')}
              >
                Departure
              </button>
            </div>
          </div>

          {filteredBuses.length === 0 ? (
            <div className="no-buses">
              <h3>No buses found 😔</h3>
              <p>Try clearing filters or searching for a different route.</p>
            </div>
          ) : (
            filteredBuses.map((bus) => (
              <div key={bus.id} className="bus-card-modern">
                
                {/* Operator */}
                <div className="bus-operator-info">
                  <span className="operator-name">{bus.operator || "TravelEase Bus"}</span>
                  <span className="bus-type-badge">{bus.busType}</span>
                  <div className="rating-chip">★ {bus.rating || 4.5}</div>
                </div>

                {/* Timeline */}
                <div className="bus-timeline">
                  <div className="time-point">
                    <span className="time-val">{formatTime(bus.departureTime)}</span>
                    <span className="city-val">{params.from}</span>
                  </div>
                  
                  <div className="duration-line-container">
                    <span className="duration-text">{getDuration(bus.departureTime, bus.arrivalTime)}</span>
                    <div className="visual-line"></div>
                  </div>

                  <div className="time-point">
                    <span className="time-val">{formatTime(bus.arrivalTime)}</span>
                    <span className="city-val">{params.to}</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="bus-price-action">
                  <div className="price-display">
                    <span className="price-sub">Starting from</span>
                    <span className="price-main">₹{bus.price}</span>
                  </div>
                  
                  <button 
                    className="select-btn"
                    onClick={() => navigate(`/seat/${bus.id}`)}
                  >
                    Select Seats
                  </button>
                  
                  <span className="seats-left">{bus.availableSeats} Seats Left</span>
                </div>

              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default BusResults;