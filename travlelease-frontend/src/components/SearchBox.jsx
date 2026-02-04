import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.source || !formData.destination || !formData.date) {
      alert("Please fill all fields");
      return;
    }
    // Navigate to search results with query params
    navigate(
      `/search?source=${formData.source}&destination=${formData.destination}&date=${formData.date}`
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
    >
      <TextField
        label="Source"
        value={formData.source}
        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Destination"
        value={formData.destination}
        onChange={(e) =>
          setFormData({ ...formData, destination: e.target.value })
        }
        sx={{ flex: 1 }}
      />
      <TextField
        label="Date of Journey"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        sx={{ flex: 1 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Search
      </Button>
    </Box>
  );
}