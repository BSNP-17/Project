import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SuccessToast from '../components/SuccessToast';
import './Profile.css';

const Profile = () => {
  const { user, login, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    gender: 'Select Gender',
    dob: ''
  });

  // Load user data — map phoneNumber (from registration) → phone
  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
        gender: user.gender || 'Select Gender',
        dob: user.dob || ''
      });
    } else if (!loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);

    const existingUserData = JSON.parse(localStorage.getItem('userData')) || {};
    const token = localStorage.getItem('token');

    const updatedUser = {
      ...existingUserData,
      fullname: formData.fullname,
      phone: formData.phone,
      phoneNumber: formData.phone,
      gender: formData.gender,
      dob: formData.dob
    };

    login(updatedUser, token);
    setShowToast(true);
  };

  if (loading || !user) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="profile-page-wrapper">
      <Navbar />

      <div className="profile-container">

        {/* --- LEFT SIDEBAR --- */}
        <aside className="profile-sidebar">
          <div className="sidebar-header">
            <div className="profile-avatar">
              {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-details">
              <h3>{user.fullname || "User"}</h3>
              <span>{user.email}</span>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              👤 Personal Details
            </button>

            <button
              className="menu-item"
              onClick={() => navigate('/my-bookings')}
            >
              🎫 My Trips
            </button>

            <button
              className={`menu-item ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => setActiveTab('wallet')}
            >
              👛 Wallet (₹0)
            </button>

            <div className="divider"></div>

            <button className="menu-item logout" onClick={handleLogout}>
              🚪 Sign Out
            </button>
          </nav>
        </aside>

        {/* --- RIGHT CONTENT AREA --- */}
        <main className="profile-content">
          <div className="content-header">
            <div>
              <h2>Personal Information</h2>
              <p>Manage your personal profile</p>
            </div>
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✎ Edit
              </button>
            )}
          </div>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-grid">

              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.fullname}
                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "readonly" : ""}
                />
              </div>

              <div className="input-group">
                <label>Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled={true}
                  className="readonly"
                />
                <span className="helper-text">Email cannot be changed</span>
              </div>

              <div className="input-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({...formData, phone: val});
                  }}
                  disabled={!isEditing}
                  className={!isEditing ? "readonly" : ""}
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="input-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "readonly" : ""}
                />
              </div>

              <div className="input-group">
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "readonly" : ""}
                >
                  <option value="Select Gender" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </main>
      </div>

      <Footer />

      {showToast && (
        <SuccessToast
          message="Profile Updated Successfully! ✅"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Profile;
