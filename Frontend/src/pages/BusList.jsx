import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import busApi from "../api/busApi";
import Navbar from "../components/Navbar";
import BusCard from "../components/BusCard"; // ✅ Import new card
import "./BusList.css";

const BusList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorting State
  const [sortBy, setSortBy] = useState("price"); // price, departure, duration

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const response = await busApi.searchBuses(from, to, date);
        setBuses(response.data);
      } catch (err) {
        setError("Failed to load buses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [from, to, date]);

  // Handle Sorting Logic
  const sortedBuses = [...buses].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "departure") return new Date(a.departureTime) - new Date(b.departureTime);
    // Add more sort logic if needed
    return 0;
  });

  return (
    <div className="bus-list-page">
      <Navbar />
      
      {/* 1. SEARCH SUMMARY HEADER */}
      <div className="search-header">
        <div className="container header-content">
          <div className="route-info">
            <span className="route-cities">{from} → {to}</span>
            <span className="route-date">📅 {date}</span>
            <button className="modify-btn" onClick={() => navigate('/home')}>Modify</button>
          </div>
        </div>
      </div>

      <div className="container main-layout">
        
        {/* 2. FILTERS SIDEBAR */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3>FILTERS</h3>
            <div className="filter-item">
              <h4>Bus Type</h4>
              <label><input type="checkbox" /> AC</label>
              <label><input type="checkbox" /> Non-AC</label>
              <label><input type="checkbox" /> Sleeper</label>
              <label><input type="checkbox" /> Seater</label>
            </div>
            
            <div className="filter-item">
              <h4>Departure Time</h4>
              <label><input type="checkbox" /> Before 6 AM</label>
              <label><input type="checkbox" /> 6 AM - 12 PM</label>
              <label><input type="checkbox" /> 12 PM - 6 PM</label>
              <label><input type="checkbox" /> After 6 PM</label>
            </div>
          </div>
        </aside>

        {/* 3. MAIN CONTENT */}
        <main className="results-content">
          
          {/* SORT BAR */}
          <div className="sort-bar">
            <span className="sort-label">SORT BY:</span>
            <button 
              className={sortBy === "price" ? "active" : ""} 
              onClick={() => setSortBy("price")}
            >
              Cheapest
            </button>
            <button 
              className={sortBy === "departure" ? "active" : ""} 
              onClick={() => setSortBy("departure")}
            >
              Departure
            </button>
            <button>Arrival</button>
            <button>Rating</button>
          </div>

          {/* BUS LIST */}
          {loading ? (
            <div className="loading-state">
               <div className="spinner"></div>
               <p>Searching for the best buses...</p>
            </div>
          ) : error ? (
            <div className="error-state">⚠️ {error}</div>
          ) : sortedBuses.length === 0 ? (
            <div className="no-buses-state">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-search-result-256-4034873.png" alt="No Buses" />
              <h3>Oops! No buses found.</h3>
              <p>Try searching for a different date or route.</p>
              <button onClick={() => navigate('/home')}>Back to Home</button>
            </div>
          ) : (
            <div className="bus-cards-container">
              {sortedBuses.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BusList;