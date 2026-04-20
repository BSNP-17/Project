import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { useCart } from '../context/CartContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if logged-in user is admin
  const isAdmin = user?.roles?.some(
    (r) => r === 'ROLE_ADMIN' || r === 'admin' || r === 'ADMIN'
  );

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
      : 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          TravelEase <span style={{ color: '#8e44ad' }}>.</span>
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

              {/* 🔴 ADMIN PANEL BUTTON — only visible to admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  style={{
                    background: '#e94560',
                    color: 'white',
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '13px',
                    textDecoration: 'none',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(233,69,96,0.35)',
                    transition: 'all 0.2s',
                  }}
                >
                  🛡️ Admin Panel
                </Link>
              )}

              {/* Cart Icon with Badge */}
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
                    padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold',
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

                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>👤 My Profile</Link>
                    <Link to="/my-bookings" className="dropdown-item" onClick={() => setShowDropdown(false)}>🎫 My Bookings</Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setShowDropdown(false)}>🛡️ Admin Panel</Link>
                    )}
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
