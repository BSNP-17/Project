import { useState, useEffect, useRef } from "react";
import { cities } from "../data/cities"; // Importing the file you created in Step 1
import "./CitySearch.css";

const CitySearch = ({ label, icon, value, onChange, placeholder }) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Sync state if parent updates the value (e.g. Swap button)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setQuery(userInput);
    setIsOpen(true);
    onChange(userInput); // Update parent state immediately

    if (userInput.length > 0) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(userInput.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = (city) => {
    setQuery(city);
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div className="city-search-wrapper" ref={wrapperRef}>
      <label className="search-label">
        <span className="search-icon">{icon}</span> {label}
      </label>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => { setIsOpen(true); setSuggestions(cities); }} 
      />
      
      {/* Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, index) => (
            <li key={index} onClick={() => handleSelectCity(city)}>
              <span className="city-icon">📍</span>
              <div className="city-info">
                <span className="city-name">{city}</span>
                <span className="city-sub">Karnataka</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;