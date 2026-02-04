import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        px: 2,
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} TravelEase. All rights reserved.
      </Typography>

      <Box sx={{ mt: 1 }}>
        <Link href="/" underline="hover" sx={{ mx: 1 }}>
          Home
        </Link>
        <Link href="/tours" underline="hover" sx={{ mx: 1 }}>
          Tours
        </Link>
        <Link href="/about" underline="hover" sx={{ mx: 1 }}>
          About Us
        </Link>
        <Link href="/contact" underline="hover" sx={{ mx: 1 }}>
          Contact
        </Link>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Made with ❤️ by B
        </Typography>
      </Box>
    </Box>
  );
}