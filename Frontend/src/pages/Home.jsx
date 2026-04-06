import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CitySearch from "../components/CitySearch"; 
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrow = tomorrowObj.toISOString().split('T')[0];
  
  const [searchData, setSearchData] = useState({ 
    from: "Bengaluru", // ✅ FIXED: Spelled with 'e' to match database
    to: "Mysuru", 
    date: today 
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchData.date) return alert("Please select a date 📅");
    if (!searchData.from || !searchData.to) return alert("Please select both cities 🏙️");
    navigate(`/buses?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
  };

  const handleSwap = () => {
    setSearchData(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  const trendingRoutes = [
    { from: "Bengaluru", to: "Goa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80", price: "850", searchDate: tomorrow }, // ✅ FIXED spelling
    { from: "Mumbai", to: "Pune", img: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80", price: "350", searchDate: tomorrow },
    { from: "Chennai", to: "Bengaluru", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80", price: "600", searchDate: tomorrow } // ✅ FIXED spelling
  ];

  return (
    <div className="home-wrapper">
      <Navbar />

      <section className="hero-modern">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Journey, <span className="highlight">Reimagined.</span>
          </h1>
          <p className="hero-subtitle">India's most beautiful bus booking experience.</p>

          <form className="search-bar-pro" onSubmit={handleSearch}>
            <CitySearch 
              label="FROM" 
              icon="📍" 
              placeholder="Source City"
              value={searchData.from}
              onChange={(val) => setSearchData({...searchData, from: val})}
            />
            
            <div className="switcher" onClick={handleSwap} title="Swap Cities">
              ⇌
            </div>
            
            <CitySearch 
              label="TO" 
              icon="🏁" 
              placeholder="Destination City"
              value={searchData.to}
              onChange={(val) => setSearchData({...searchData, to: val})}
            />
            
            <div className="date-box">
              <label>DEPARTURE DATE</label>
              <input 
                type="date" 
                value={searchData.date}
                min={today}
                onChange={e => setSearchData({...searchData, date: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="search-btn-pro">SEARCH</button>
          </form>
        </div>
      </section>

      <section className="section-container">
        <h2 className="section-title">Trending Getaways 🌴</h2>
        <div className="cards-grid">
          {trendingRoutes.map((route, index) => (
            <div 
              key={index} 
              className="destination-card" 
              onClick={() => navigate(`/buses?from=${route.from}&to=${route.to}&date=${route.searchDate}`)}
            >
              <img src={route.img} alt={route.to} />
              <div className="card-info">
                <h3>{route.from} ➝ {route.to}</h3>
                <p>Starting from <span className="price">₹{route.price}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="features-section">
        <div className="feature">
          <div className="icon">🛡️</div>
          <h3>Safe Travel</h3>
          <p>Sanitized buses & trained staff.</p>
        </div>
        <div className="feature">
          <div className="icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>Book in less than 2 minutes.</p>
        </div>
        <div className="feature">
          <div className="icon">💳</div>
          <h3>Secure Payments</h3>
          <p>Refunds processed instantly.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;