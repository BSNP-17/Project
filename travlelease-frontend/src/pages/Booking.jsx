import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  Box,
  TextField,
  Divider,
} from "@mui/material";
import axios from "../axiosConfig";
import SeatMap from "../components/SeatMap";
import PassengerForm from "../components/PassengerForm";
import JourneyTracker from "../components/JourneyTracker";

export default function Booking() {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passenger, setPassenger] = useState({ name: "", age: "", gender: "" });
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await axios.get(`/api/buses/${busId}`);
        setBus(response.data);
      } catch (err) {
        setError("Failed to load bus details.");
      }
    };
    fetchBus();
  }, [busId]);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }
    if (!passenger.name || !passenger.age || !passenger.gender) {
      setError("Please fill passenger details.");
      return;
    }

    try {
      const response = await axios.post(`/api/bookings`, {
        busId,
        seats: selectedSeats,
        passenger,
      });
      navigate("/payment", { state: { bookingId: response.data.id } });
    } catch (err) {
      setError("Booking failed. Please try again.");
    }
  };

  // Fare calculation
  const baseFare = bus ? selectedSeats.length * bus.price : 0;
  const finalFare = baseFare - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE20") {
      setDiscount(baseFare * 0.2); // 20% off
    } else if (promoCode.toUpperCase() === "FLAT100") {
      setDiscount(100); // flat ₹100 off
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
  <JourneyTracker activeStep={0} passengers={[passenger]} /> 
  <JourneyTracker activeStep={0} passengers={[passengerList]} />  {/* 0 = Choose Seats */}
  <Typography variant="h4" gutterBottom>
    Booking
  </Typography>


      {error && <Alert severity="error">{error}</Alert>}

      {bus ? (
        <Paper sx={{ p: 4, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {bus.name} ({bus.type})
          </Typography>
          <Typography gutterBottom>
            {bus.departure} → {bus.arrival}
          </Typography>
          <Typography gutterBottom>Fare per seat: ₹{bus.price}</Typography>

          {/* Seat Selection */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Select Seats</Typography>
            <SeatMap seats={bus.seats} onSelect={setSelectedSeats} />
          </Box>

          {/* Passenger Details */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Passenger Details</Typography>
            <PassengerForm passenger={passenger} setPassenger={setPassenger} />
          </Box>

          {/* Fare Summary with Promo */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Fare Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              Selected Seats: {selectedSeats.join(", ") || "None"}
            </Typography>
            <Typography variant="body1">Base Fare: ₹{baseFare}</Typography>
            <Typography variant="body1" color="success.main">
              Discount: -₹{discount}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mt: 1, color: "primary.main" }}
            >
              Total Fare: ₹{finalFare > 0 ? finalFare : 0}
            </Typography>

            {/* Promo Code Input */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <TextField
                label="Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={applyPromo}
              >
                Apply
              </Button>
            </Box>
          </Box>

          {/* Confirm Booking */}
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              Proceed to Payment
            </Button>
          </Box>
        </Paper>
      ) : (
        <Typography>Loading bus details...</Typography>
      )}
    </Container>
  );
}