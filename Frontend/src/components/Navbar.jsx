import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { useCart } from '../context/CartContext.jsx'; // ✅ Added Cart Context
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart(); // ✅ Get cart state
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          TravelEase <span style={{color:'#8e44ad'}}>.</span>
        </Link>
        
        <div className="navbar-links">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Log in</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link to="/home" className="nav-link">Home</Link>
              <Link to="/my-bookings" className="nav-link">My Trips</Link>
              
              {/* ✅ NEW: Cart Icon with Badge */}
              <button 
                className="nav-link" 
                onClick={() => navigate('/cart')}
                style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0' }}
              >
                🛒 Cart
                {cart?.length > 0 && (
                  <span style={{
                    position: 'absolute', top: '-10px', right: '-15px',
                    background: '#ff6b35', color: 'white', borderRadius: '50%',
                    padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold'
                  }}>
                    {cart.length}
                  </span>
                )}
              </button>

              {/* User Avatar with Dropdown */}
              <div 
                className="user-profile" 
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="avatar-circle">
                  {getInitials(user.fullname || user.username)}
                </div>
                <span className="user-name">{user.fullname?.split(' ')[0] || 'User'}</span>
                
                {/* The Dropdown Menu */}
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">👤 My Profile</Link>
                    <Link to="/my-bookings" className="dropdown-item">🎫 My Bookings</Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;