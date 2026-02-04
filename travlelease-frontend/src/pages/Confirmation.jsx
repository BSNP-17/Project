import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import JourneyTracker from "../components/JourneyTracker";
import jsPDF from "jspdf";

export default function Confirmation() {
  const location = useLocation();
  const bookingId = location.state?.bookingId || "UNKNOWN";

  const [showTicket, setShowTicket] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Example departure time (replace with bus.departureTime from backend)
  const departureTime = new Date("2026-02-04T06:30:00"); // 4 Feb, 6:30 AM

  useEffect(() => {
    const timer = setTimeout(() => setShowTicket(true), 1000);

    const countdown = setInterval(() => {
      const now = new Date();
      const diff = departureTime - now;

      if (diff <= 0) {
        setTimeLeft("Departed");
        clearInterval(countdown);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("TravelEase Bus Ticket", 20, 20);
    doc.text(`Booking ID: ${bookingId}`, 20, 40);
    doc.text("Passenger: John Doe", 20, 55);
    doc.text("Bus: TravelEase Express", 20, 70);
    doc.text("Route: Kumta → Bangalore", 20, 85);
    doc.text("Date: 03 Feb 2026", 20, 100);
    doc.text("Seats: L1, L2", 20, 115);
    doc.text("Fare Paid: ₹2400", 20, 130);

    const qrCanvas = document.querySelector("canvas");
    if (qrCanvas) {
      const qrData = qrCanvas.toDataURL("image/png");
      doc.addImage(qrData, "PNG", 150, 40, 40, 40);
    }

    doc.save(`Ticket-${bookingId}.pdf`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <JourneyTracker activeStep={3} passengers={[]} />

      <Typography variant="h4" gutterBottom>
        Booking Confirmed 🎉
      </Typography>

      {/* Ticket Style */}
      <Paper
        sx={{
          mt: 4,
          p: 0,
          borderRadius: 3,
          backgroundColor: "#fff",
          boxShadow: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {/* Left side: QR Code */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "2px dashed #ccc",
            }}
          >
            <Typography variant="h6">Your Ticket</Typography>
            <Box
              sx={{
                opacity: showTicket ? 1 : 0,
                transform: showTicket ? "translateY(0)" : "translateY(-50px)",
                transition: "all 0.8s ease",
                mt: 2,
              }}
            >
              <QRCode value={`BOOKING-${bookingId}`} size={150} />
            </Box>
            <Typography variant="caption" sx={{ mt: 1 }}>
              Scan at boarding
            </Typography>
          </Box>

          {/* Right side: Trip Details */}
          <Box sx={{ flex: 2, p: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Booking ID: {bookingId}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">Passenger: John Doe</Typography>
            <Typography variant="body2">Bus: TravelEase Express</Typography>
            <Typography variant="body2">Route: Kumta → Bangalore</Typography>
            <Typography variant="body2">Date: 04 Feb 2026</Typography>
            <Typography variant="body2">Seats: L1, L2</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
              Fare Paid: ₹2400
            </Typography>

            {/* Boarding Countdown */}
            <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: "#f0f8ff" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                Boarding Countdown: {timeLeft}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      {/* Boarding Gate Animation */}
{timeLeft === "Departed" && (
  <Box
    sx={{
      mt: 3,
      position: "relative",
      height: 100,
      backgroundColor: "#1976d2",
      borderRadius: 2,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: 20,
    }}
  >
    {/* Left Door */}
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "50%",
        backgroundColor: "#0d47a1",
        animation: "doorLeft 2s forwards",
      }}
    />
    {/* Right Door */}
    <Box
      sx={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "50%",
        backgroundColor: "#0d47a1",
        animation: "doorRight 2s forwards",
      }}
    />
    Boarding Now! 🚌
  </Box>
)}

      {/* Download Button */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button variant="contained" color="secondary" onClick={handleDownload}>
          Download Ticket (PDF)
        </Button>
      </Box>
    </Container>
  );
}