import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Profile.css';

const Profile = () => {
  // ✅ Extract 'login' from useAuth so we can update the global user state
  const { user, login, logout, loading } = useAuth();
  const navigate = useNavigate();

  // State for toggling Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for Active Tab (Sidebar)
  const [activeTab, setActiveTab] = useState('info'); 

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    gender: 'Select Gender',
    dob: ''
  });

  // Load User Data
  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '9876543210', // Mock Data if missing
        gender: user.gender || 'Male',
        dob: user.dob || '1995-08-15'
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
    
    // 1. Get the existing user data and token from local storage
    const existingUserData = JSON.parse(localStorage.getItem('userData')) || {};
    const token = localStorage.getItem('token');
    
    // 2. Merge the old data with the new form data
    const updatedUser = {
      ...existingUserData,
      fullname: formData.fullname,
      phone: formData.phone,
      gender: formData.gender,
      dob: formData.dob
    };

    // 3. Update localStorage and the global context at the same time!
    login(updatedUser, token); 

    alert("Profile Updated Successfully! ✅");
  };

  if (loading || !user) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="profile-page-wrapper">
      <Navbar />
      
      <div className="profile-container">
        
        {/* --- LEFT SIDEBAR --- */}
        <aside className="profile-sidebar">
          
          {/* User Brief */}
          <div className="sidebar-header">
            <div className="profile-avatar">
              {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-details">
              <h3>{user.fullname || "User"}</h3>
              <span>{user.email}</span>
            </div>
          </div>

          {/* Navigation Menu */}
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
          
          {/* Header of the Card */}
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

          {/* The Form */}
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
                  disabled={true} // Email usually can't be changed
                  className="readonly"
                />
                <span className="helper-text">Email cannot be changed</span>
              </div>

              <div className="input-group">
                <label>Mobile Number</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "readonly" : ""}
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
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            {/* Action Buttons (Only show in Edit Mode) */}
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
    </div>
  );
};

export default Profile;