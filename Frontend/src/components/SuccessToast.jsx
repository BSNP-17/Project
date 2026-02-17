import { useState, useEffect } from 'react';
// SuccessToast.jsx (keep this import)
import './SuccessToast.css';  // ✅ CSS stays HERE only


const SuccessToast = ({ message = "Successfully Registered! 🎉", onClose }) => {
  useEffect(() => {
    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-overlay">
      <div className="success-toast">
        <div className="checkmark-container">
          <div className="checkmark-circle">
            <svg className="checkmark-svg" viewBox="0 0 66 66">
              <circle className="checkmark-circle-bg" cx="33" cy="33" r="30" fill="none"/>
              <polyline className="checkmark-path" points="18,30 27,40 48,22" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h3 className="toast-title">{message}</h3>
        <p className="toast-subtitle">Welcome to TravelEase! Ready to explore?</p>
        <button className="close-toast" onClick={onClose}>✕</button>
        <div className="confetti"></div>
      </div>
    </div>
  );
};

export default SuccessToast;
