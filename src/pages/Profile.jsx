// Profile.jsx
import React from 'react';
import './Profile.css';

const Profile = () => {
  // Sample user data - replace with props from parent or context/useState from auth
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    bookings: 5,
    joined: 'Jan 2025'
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src="https://via.placeholder.com/120x120?text=JD" alt="Profile" className="profile-avatar" />
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-tagline">Frequent Traveler</p>
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <p>{user.phone}</p>
          </div>
          <div className="detail-item">
            <label>Total Bookings</label>
            <p>{user.bookings}</p>
          </div>
          <div className="detail-item">
            <label>Member Since</label>
            <p>{user.joined}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-btn">Edit Profile</button>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
