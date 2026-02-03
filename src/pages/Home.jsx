import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // Quick date helpers
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterTomorrow = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1
  });

  // User auth state
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwap = () => {
    setSearchData({
      from: searchData.to,
      to: searchData.from,
    });
  };

  const handleQuickDate = (date) => {
    setSearchData({
      ...searchData,
      date: date
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchData.from || !searchData.to || !searchData.date) {
      alert("Please fill From, To, and Date");
      return;
    }

    const params = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      passengers: searchData.passengers
    });
    
    navigate(`/buses?${params.toString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="home-wrapper">
      {/* Header - UPDATED WITH PROFILE */}
      <header className="top-header">
        <div className="header-inner">
          <div className="brand">
            <h1>Karnataka Travel</h1>
            <span>by TravelEase</span>
          </div>
          
          {/* ✅ NEW: Smart Auth Header */}
          <div className="header-actions">
            {user ? (
              /* Logged In - Profile Dropdown */
              <div className="user-profile">
                <div className="user-avatar" onClick={() => navigate('/profile')}>
                  {user.name ? user.name.charAt(0) + user.name.charAt(user.name.length - 1) : 'U'}
                </div>
                <div className="user-menu">
                  <button className="profile-btn" onClick={() => navigate('/profile')}>
                    Profile
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              /* Not Logged In */
              <>
                <a href="/login" className="btn ghost">Login</a>
                <a href="/register" className="btn primary">Sign Up</a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>
            Book Buses Across <span>Karnataka</span>
          </h2>
          <p>Trusted by millions · Fast · Secure · Affordable</p>

          {/* Search Card */}
          <form className="search-card" onSubmit={handleSearch}>
            <div className="field-group">
              <div className="field">
                <label>From</label>
                <div className="select-wrapper">
                  <select
                    name="from"
                    value={searchData.from}
                    onChange={handleChange}
                    className="location-select"
                    required
                  >
                    <option value="">📍 From City</option>
                    <option value="Bengaluru">Bengaluru (Majestic)</option>
                    <option value="Mysuru">Mysuru (KSRTC)</option>
                    <option value="Mangaluru">Mangaluru</option>
                    <option value="Hubballi">Hubballi</option>
                    <option value="Belagavi">Belagavi</option>
                    <option value="Davangere">Davangere</option>
                    <option value="Udupi">Udupi</option>
                    <option value="Shimoga">Shimoga</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="swap-btn"
                onClick={handleSwap}
                aria-label="Swap locations"
              >
                ⇅
              </button>

              <div className="field">
                <label>To</label>
                <div className="select-wrapper">
                  <select
                    name="to"
                    value={searchData.to}
                    onChange={handleChange}
                    className="location-select"
                    required
                  >
                    <option value="">📍 To City</option>
                    <option value="Bengaluru">Bengaluru (Majestic)</option>
                    <option value="Mysuru">Mysuru (KSRTC)</option>
                    <option value="Mangaluru">Mangaluru</option>
                    <option value="Hubballi">Hubballi</option>
                    <option value="Belagavi">Belagavi</option>
                    <option value="Davangere">Davangere</option>
                    <option value="Udupi">Udupi</option>
                    <option value="Shimoga">Shimoga</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Passengers */}
            <div className="date-row">
              <div className="field date-field">
                <label>Departure Date</label>
                
                {/* Quick Date Buttons */}
                <div className="quick-dates">
                  <button 
                    type="button" 
                    className={`quick-date-btn ${searchData.date === today ? 'active' : ''}`}
                    onClick={() => handleQuickDate(today)}
                  >
                    Today
                  </button>
                  <button 
                    type="button" 
                    className={`quick-date-btn ${searchData.date === tomorrow ? 'active' : ''}`}
                    onClick={() => handleQuickDate(tomorrow)}
                  >
                    Tomorrow
                  </button>
                  <button 
                    type="button" 
                    className={`quick-date-btn ${searchData.date === dayAfterTomorrow ? 'active' : ''}`}
                    onClick={() => handleQuickDate(dayAfterTomorrow)}
                  >
                    Day After
                  </button>
                </div>
                
                {/* Date Picker */}
                <input
                  type="date"
                  name="date"
                  value={searchData.date}
                  onChange={handleChange}
                  className="date-input"
                  required
                  min={today}
                />
              </div>
              
              <div className="field passenger-field">
                <label>Passengers</label>
                <select 
                  name="passengers" 
                  value={searchData.passengers} 
                  onChange={handleChange}
                  className="passenger-select"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="search-cta" 
              disabled={!searchData.from || !searchData.to || !searchData.date}
            >
              🔍 Search Buses
            </button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat">
          <h3>4.5 Cr+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat">
          <h3>35L+</h3>
          <p>Bookings</p>
        </div>
        <div className="stat">
          <h3>2500+</h3>
          <p>Operators</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
