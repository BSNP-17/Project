import React from 'react';
import './Button.css';

const Button = ({ text, onClick, type = "button", variant = "primary", disabled = false }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`btn-custom ${variant} ${disabled ? 'disabled' : ''}`}
    >
      {text}
    </button>
  );
};

export default Button;