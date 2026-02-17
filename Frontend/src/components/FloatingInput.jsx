import { useState } from 'react';
import './FloatingInput.css';

const FloatingInput = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  icon, 
  error 
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Toggle Password Visibility
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`floating-input-group ${error ? 'has-error' : ''}`}>
      <div className={`input-wrapper ${focused || value ? 'active' : ''}`}>
        
        {/* The Input Field */}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="form-control"
          placeholder=" " /* Needed for CSS trick */
        />
        
        {/* The Floating Label */}
        <label className="floating-label">{label}</label>

        {/* Left Icon (optional) */}
        {icon && <span className="input-icon">{icon}</span>}

        {/* Password Toggle Button */}
        {isPassword && (
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FloatingInput;