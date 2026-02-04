import React from "react";
import { Box, Typography } from "@mui/material";
import { DirectionsBus, Person, Woman, Man, ChildCare } from "@mui/icons-material";

const steps = [
  "Choose Seats",
  "Passenger Info",
  "Payment",
  "Confirmation",
];

export default function JourneyTracker({ activeStep, passengers = [] }) {
  const progressPercent = (activeStep / (steps.length - 1)) * 100;

  const getPassengerIcon = (p) => {
    if (p.gender === "male") return <Man sx={{ fontSize: 24, color: "#2196f3" }} />;
    if (p.gender === "female") return <Woman sx={{ fontSize: 24, color: "#e91e63" }} />;
    if (p.age && p.age < 12) return <ChildCare sx={{ fontSize: 24, color: "#ff9800" }} />;
    return <Person sx={{ fontSize: 24, color: "#4caf50" }} />;
  };

  return (
    <Box sx={{ width: "100%", mb: 4, position: "relative" }}>
      {/* Track Line */}
      <Box
        sx={{
          height: 6,
          backgroundColor: "#e0e0e0",
          borderRadius: 3,
          position: "relative",
        }}
      >
        {/* Progress Line */}
        <Box
          sx={{
            height: 6,
            backgroundColor: "#1976d2",
            borderRadius: 3,
            width: `${progressPercent}%`,
            transition: "width 0.5s ease",
          }}
        />
      </Box>

      {/* Moving Bus + Passengers */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          left: `${progressPercent}%`,
          transform: "translateX(-50%)",
          transition: "left 0.5s ease",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <DirectionsBus
          sx={{
            fontSize: 50,
            color: "#1976d2",
            filter: "drop-shadow(0 0 6px #1976d2)",
          }}
        />

        {/* Passengers boarding */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {passengers.map((p, index) => (
            <Box
              key={index}
              sx={{
                animation: "fadeIn 0.5s ease",
              }}
            >
              {getPassengerIcon(p)}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Step Labels */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        {steps.map((label, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              fontWeight: activeStep === index ? "bold" : "normal",
              color: activeStep === index ? "#1976d2" : "text.secondary",
              transition: "color 0.3s ease",
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}