import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import SearchBox from "../components/SearchBox";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #009688, #FF7043)",
          color: "white",
          borderRadius: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to TravelEase
        </Typography>
        <Typography variant="h6" gutterBottom>
          Book your bus tickets easily, quickly, and securely
        </Typography>
      </Paper>

      {/* Search Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Search for Buses
        </Typography>
        <SearchBox />
      </Box>

      {/* Optional Featured Routes */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          Popular Routes
        </Typography>
        <ul>
          <li>Kumta → Bangalore</li>
          <li>Kumta → Goa</li>
          <li>Kumta → Mangalore</li>
        </ul>
      </Box>
    </Container>
  );
}