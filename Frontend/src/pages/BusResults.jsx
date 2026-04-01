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
  
  const fromCity = searchParams.get("from") || "Bangaluru";
  const toCity = searchParams.get("to") || "Mysuru";
  const searchDate = searchParams.get("date") || new Date().toISOString().split('T')[0];

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const response = await busApi.searchBuses(fromCity, toCity, searchDate);
        if (response.data && response.data.length > 0) {
          setBuses(response.data);
        } else {
          loadMockBuses(); // Fallback if DB is empty
        }
      } catch (err) {
        console.warn("Backend unavailable. Loading Mock Data...");
        loadMockBuses(); // Fallback if Backend is down
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [fromCity, toCity, searchDate]);

  // 🚀 Realistic Mock Data (Ensures you always have UI to look at)
  const loadMockBuses = () => {
    const fakeBuses = [
      {
        id: "mock-1",
        operator: "KSRTC (Airavat)",
        busType: "Volvo Multi-Axle A/C Semi Sleeper (2+2)",
        fromCity: fromCity,
        toCity: toCity,
        departureTime: `${searchDate}T06:30:00`,
        arrivalTime: `${searchDate}T10:15:00`,
        price: 450,
        availableSeats: 24,
        rating: 4.6,
        amenities: ["Water Bottle", "Blanket", "Charging Point"]
      },
      {
        id: "mock-2",
        operator: "VRL Travels",
        busType: "A/C Sleeper (2+1)",
        fromCity: fromCity,
        toCity: toCity,
        departureTime: `${searchDate}T22:00:00`,
        arrivalTime: `${searchDate}T04:30:00`, 
        price: 850,
        availableSeats: 8,
        rating: 4.2,
        amenities: ["Pillow", "Reading Light", "Charging Point", "WiFi"]
      },
      {
        id: "mock-3",
        operator: "SRS Travels",
        busType: "Non A/C Seater (2+2)",
        fromCity: fromCity,
        toCity: toCity,
        departureTime: `${searchDate}T14:00:00`,
        arrivalTime: `${searchDate}T19:00:00`,
        price: 350,
        availableSeats: 32,
        rating: 3.9,
        amenities: ["Push Back Seats", "Emergency Exit"]
      },
      {
        id: "mock-4",
        operator: "IntrCity SmartBus",
        busType: "A/C Sleeper/Seater (2+1)",
        fromCity: fromCity,
        toCity: toCity,
        departureTime: `${searchDate}T23:30:00`,
        arrivalTime: `${searchDate}T06:00:00`,
        price: 999,
        availableSeats: 4,
        rating: 4.8,
        amenities: ["Live Tracking", "Water Bottle", "Blanket", "Washroom"]
      }
    ];
    setBuses(fakeBuses);
  };

  // 🔀 Sorting Logic
  const sortedBuses = [...buses].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "departure") return new Date(a.departureTime) - new Date(b.departureTime);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  if (loading) return <Spinner />;

  return (
    <div className="bus-results-page">
      <Navbar />
      
      {/* 1. TOP HEADER (RedBus Style) */}
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
        
        {/* 2. FILTERS SIDEBAR */}
        <aside className="sidebar-filters">
          <div className="filter-block">
            <h3>FILTERS</h3>
            <div className="filter-section">
              <h4>Bus Type</h4>
              <label className="checkbox-label"><input type="checkbox" /> AC</label>
              <label className="checkbox-label"><input type="checkbox" /> Non-AC</label>
              <label className="checkbox-label"><input type="checkbox" /> Sleeper</label>
              <label className="checkbox-label"><input type="checkbox" /> Seater</label>
            </div>
            
            <div className="filter-section">
              <h4>Departure Time</h4>
              <label className="checkbox-label"><input type="checkbox" /> Before 6 AM</label>
              <label className="checkbox-label"><input type="checkbox" /> 6 AM to 12 PM</label>
              <label className="checkbox-label"><input type="checkbox" /> 12 PM to 6 PM</label>
              <label className="checkbox-label"><input type="checkbox" /> After 6 PM</label>
            </div>
          </div>
        </aside>

        {/* 3. MAIN CONTENT */}
        <main className="main-buses-list">
          
          {/* SORT TABS */}
          <div className="sort-tabs">
            <span className="sort-title">Sort By:</span>
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
              Departure Time
            </button>
            <button 
              className={sortBy === "rating" ? "active" : ""} 
              onClick={() => setSortBy("rating")}
            >
              Highest Rated
            </button>
          </div>

          {/* BUS CARDS */}
          <div className="cards-wrapper">
            {sortedBuses.map((bus) => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusResults;