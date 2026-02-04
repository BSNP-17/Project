import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BusCard({ bus }) {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/booking/${bus.id}`);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6">{bus.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {bus.type} | {bus.seatsAvailable} seats left
            </Typography>
            <Typography variant="body2">
              {bus.departure} → {bus.arrival}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6">₹{bus.price}</Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ mt: 1 }}
              onClick={handleBook}
            >
              Book Now
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}