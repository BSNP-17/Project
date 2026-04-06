import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import busApi from "../api/busApi";
import Navbar from "../components/Navbar";
import BusCard from "../components/BusCard"; 
import Spinner from "../components/Spinner";
import "./BusResults.css";

const BusResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const fromCity = searchParams.get("from") || "Bengaluru";
  const toCity = searchParams.get("to") || "Mysuru";
  const searchDate = searchParams.get("date") || new Date().toISOString().split('T')[0];

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price");

  // ALL FILTERS STATE (Bus Type + Departure Time)
  const [filters, setFilters] = useState({
    ac: false,
    nonAc: false,
    sleeper: false,
    seater: false,
    before6am: false,
    am6to12pm: false,
    pm12to6pm: false,
    after6pm: false
  });

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const response = await busApi.searchBuses(fromCity, toCity, searchDate);
        
        // ✅ QA TEST 8 STRICT MODE: Do not load mock buses. Show empty state if not found.
        if (response.data && response.data.length > 0) {
          setBuses(response.data);
        } else {
          setBuses([]); 
        }
      } catch (err) {
        console.warn("Backend unavailable. QA Strict Mode: Returning 0 buses.");
        setBuses([]); // ✅ Forces failure on invalid routes
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [fromCity, toCity, searchDate]);

  // HANDLE CHECKBOX CLICKS
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  // THE DUAL-FILTER ENGINE
  const filteredAndSortedBuses = buses
    .filter((bus) => {
      // --- A. BUS TYPE FILTERING ---
      const typeActive = filters.ac || filters.nonAc || filters.sleeper || filters.seater;
      let typeMatch = !typeActive;

      if (typeActive) {
        const typeStr = (bus.busType || "").toLowerCase();
        const isAc = (typeStr.includes("ac") || typeStr.includes("a/c")) && !typeStr.includes("non-ac") && !typeStr.includes("non ac");
        const isNonAc = typeStr.includes("non-ac") || typeStr.includes("non ac");
        const isSleeper = typeStr.includes("sleeper");
        const isSeater = typeStr.includes("seater") || !isSleeper; 

        if (filters.ac && isAc) typeMatch = true;
        if (filters.nonAc && isNonAc) typeMatch = true;
        if (filters.sleeper && isSleeper) typeMatch = true;
        if (filters.seater && isSeater) typeMatch = true;
      }

      // --- B. DEPARTURE TIME FILTERING ---
      const timeActive = filters.before6am || filters.am6to12pm || filters.pm12to6pm || filters.after6pm;
      let timeMatch = !timeActive;

      if (timeActive && bus.departureTime) {
        const hour = new Date(bus.departureTime).getHours();
        
        if (filters.before6am && hour < 6) timeMatch = true;
        if (filters.am6to12pm && hour >= 6 && hour < 12) timeMatch = true;
        if (filters.pm12to6pm && hour >= 12 && hour < 18) timeMatch = true;
        if (filters.after6pm && hour >= 18) timeMatch = true;
      }

      return typeMatch && timeMatch; 
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "departure") return new Date(a.departureTime) - new Date(b.departureTime);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  if (loading) return <Spinner />;

  return (
    <div className="bus-results-page">
      <Navbar />
      
      <div className="results-header-banner">
        <div className="container header-flex">
          <div className="route-info">
            <h1>{fromCity} <span className="arrow">→</span> {toCity}</h1>
            <p>{new Date(searchDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          </div>
          <button className="modify-btn" onClick={() => navigate('/home')}>Modify Search</button>
        </div>
      </div>

      <div className="container results-layout">
        
        <aside className="sidebar-filters">
          <div className="filter-block">
            <h3>FILTERS</h3>
            
            <div className="filter-section">
              <h4>Bus Type</h4>
              <label className="checkbox-label">
                <input type="checkbox" name="ac" checked={filters.ac} onChange={handleFilterChange} /> AC
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="nonAc" checked={filters.nonAc} onChange={handleFilterChange} /> Non-AC
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="sleeper" checked={filters.sleeper} onChange={handleFilterChange} /> Sleeper
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="seater" checked={filters.seater} onChange={handleFilterChange} /> Seater
              </label>
            </div>
            
            <div className="filter-section">
              <h4>Departure Time</h4>
              <label className="checkbox-label">
                <input type="checkbox" name="before6am" checked={filters.before6am} onChange={handleFilterChange} /> Before 6 AM
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="am6to12pm" checked={filters.am6to12pm} onChange={handleFilterChange} /> 6 AM to 12 PM
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="pm12to6pm" checked={filters.pm12to6pm} onChange={handleFilterChange} /> 12 PM to 6 PM
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="after6pm" checked={filters.after6pm} onChange={handleFilterChange} /> After 6 PM
              </label>
            </div>
            
          </div>
        </aside>

        <main className="main-buses-list">
          <div className="sort-tabs">
            <span className="sort-title">Sort By:</span>
            <button className={sortBy === "price" ? "active" : ""} onClick={() => setSortBy("price")}>Cheapest</button>
            <button className={sortBy === "departure" ? "active" : ""} onClick={() => setSortBy("departure")}>Departure Time</button>
            <button className={sortBy === "rating" ? "active" : ""} onClick={() => setSortBy("rating")}>Highest Rated</button>
          </div>

          <div className="cards-wrapper">
            {filteredAndSortedBuses.length > 0 ? (
              filteredAndSortedBuses.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
                <h3>No buses found for this route 🚌</h3>
                <p>Try searching for a different date or city, or adjusting your filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusResults;