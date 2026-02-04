import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import BusCard from "../components/BusCard";
import axios from "../axiosConfig";

export default function SearchResults() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const query = new URLSearchParams(useLocation().search);
  const source = query.get("source");
  const destination = query.get("destination");
  const date = query.get("date");

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `/api/buses?source=${source}&destination=${destination}&date=${date}`
        );
        setBuses(response.data);
      } catch (err) {
        setError("Failed to fetch buses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (source && destination && date) {
      fetchBuses();
    }
  }, [source, destination, date]);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Available Buses
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {buses.length === 0 && !loading && !error && (
        <Typography>No buses found for your search.</Typography>
      )}

      {buses.map((bus) => (
        <BusCard key={bus.id} bus={bus} />
      ))}
    </Container>
  );
}