import React, { useState, useEffect } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Divider,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import HistoryIcon from "@mui/icons-material/History";
import StarIcon from "@mui/icons-material/Star";

function NotFound() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [history, setHistory] = useState([]);

  // Popular routes fallback
  const popularRoutes = [
    { route: "Kumta → Bangalore", operator: "VRL Travels", departure: "06:30 AM", price: "₹1200" },
    { route: "Kumta → Goa", operator: "Sugama Travels", departure: "08:00 AM", price: "₹900" },
    { route: "Kumta → Mangalore", operator: "KSRTC", departure: "07:15 AM", price: "₹700" },
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setHistory(saved);
  }, []);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    setLoading(true);

    const res = await fetch(`/api/routes?query=${e.target.value}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    const combinedList = [...results, ...history];
    if (combinedList.length === 0 && query) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % combinedList.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + combinedList.length) % combinedList.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      const selected = combinedList[activeIndex];
      alert(`Selected: ${selected.route || selected}`);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("recentSearches");
    setHistory([]);
  };

  const showFallback = results.length === 0 && history.length === 0 && query;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Oops! Page not found 🚧</h2>
      <TextField
        label="Search buses or routes"
        variant="outlined"
        value={query}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        fullWidth
      />

      {loading && <CircularProgress style={{ marginTop: "1rem" }} />}

      <List>
        {results.map((route, idx) => (
          <ListItem
            key={idx}
            selected={idx === activeIndex}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setActiveIndex(idx)}
            onClick={() => alert(`Selected: ${route.route}`)}
          >
            <ListItemIcon>
              <DirectionsBusIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={route.route}
              secondary={
                <>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon fontSize="small" style={{ marginRight: 4 }} />
                    {route.departure}
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <CurrencyRupeeIcon fontSize="small" style={{ marginRight: 4 }} />
                    {route.price}
                  </span>
                </>
              }
            />
          </ListItem>
        ))}

        {history.length > 0 && (
          <>
            <Divider />
            {history.map((item, idx) => {
              const historyIndex = results.length + idx;
              return (
                <ListItem
                  key={idx}
                  selected={historyIndex === activeIndex}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setActiveIndex(historyIndex)}
                  onClick={() => alert(`Selected: ${item}`)}
                >
                  <ListItemIcon>
                    <HistoryIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary={item} secondary="Recent search" />
                </ListItem>
              );
            })}
            <ListItem button onClick={clearHistory}>
              <ListItemText primary="Clear history" />
            </ListItem>
          </>
        )}

        {showFallback && (
          <>
            <Divider />
            <h4 style={{ textAlign: "left", margin: "1rem 0" }}>Popular Routes</h4>
            {popularRoutes.map((route, idx) => (
              <ListItem key={idx} style={{ cursor: "pointer" }}>
                <ListItemIcon>
                  <StarIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={route.route}
                  secondary={`${route.operator} • ${route.departure} • ${route.price}`}
                />
              </ListItem>
            ))}
          </>
        )}
      </List>
    </div>
  );
}

export default NotFound;