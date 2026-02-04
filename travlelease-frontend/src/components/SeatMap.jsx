import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

export default function SeatMap({ seats, onSelect }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [deck, setDeck] = useState("lower");

  const handleSeatClick = (seat) => {
    if (seat.booked) return;

    let updatedSeats;
    if (selectedSeats.includes(seat.number)) {
      updatedSeats = selectedSeats.filter((s) => s !== seat.number);
    } else {
      updatedSeats = [...selectedSeats, seat.number];
    }
    setSelectedSeats(updatedSeats);
    onSelect(updatedSeats);
  };

  const renderSeats = (deckSeats) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 60px)",
        gap: 2,
        justifyContent: "center",
      }}
    >
      {deckSeats.map((seat) => {
        const isSelected = selectedSeats.includes(seat.number);
        const seatColor = seat.booked
          ? "grey"
          : isSelected
          ? "green"
          : seat.type === "sleeper"
          ? "purple"
          : "lightblue";

        return (
          <Button
            key={seat.number}
            variant="contained"
            onClick={() => handleSeatClick(seat)}
            sx={{
              height: seat.type === "sleeper" ? 70 : 50, // taller for sleeper
              backgroundColor: seatColor,
              color: "white",
              "&:hover": {
                backgroundColor: seat.booked
                  ? "grey"
                  : isSelected
                  ? "darkgreen"
                  : seat.type === "sleeper"
                  ? "indigo"
                  : "blue",
              },
            }}
          >
            {seat.number}
          </Button>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1" gutterBottom>
        Select seats from {deck === "lower" ? "Lower Deck" : "Upper Deck"}
      </Typography>

      {/* Deck Toggle */}
      <ToggleButtonGroup
        value={deck}
        exclusive
        onChange={(e, newDeck) => newDeck && setDeck(newDeck)}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="lower">Lower Deck</ToggleButton>
        <ToggleButton value="upper">Upper Deck</ToggleButton>
      </ToggleButtonGroup>

      {/* Seat Grid */}
      {renderSeats(seats[deck])}

      {/* Legend */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: "lightblue" }} />
          <Typography variant="caption">Available (Seater)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: "purple" }} />
          <Typography variant="caption">Available (Sleeper)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: "green" }} />
          <Typography variant="caption">Selected</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: "grey" }} />
          <Typography variant="caption">Booked</Typography>
        </Box>
      </Box>

      {/* Selected Seats Summary */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Selected Seats: {selectedSeats.join(", ") || "None"}
        </Typography>
      </Box>
    </Box>
  );
}