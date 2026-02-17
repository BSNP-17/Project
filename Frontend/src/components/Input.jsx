import React from 'react';
import './Input.css';

const Input = ({ label, type, name, value, onChange, placeholder, required = false }) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-custom"
      />
    </div>
  );
};

export default Input;