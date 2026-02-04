import React from "react";
import { TextField, MenuItem, Box } from "@mui/material";

export default function PassengerForm({ passenger, setPassenger }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Name"
        value={passenger.name}
        onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
      />
      <TextField
        label="Age"
        type="number"
        value={passenger.age}
        onChange={(e) => setPassenger({ ...passenger, age: e.target.value })}
      />
      <TextField
        select
        label="Gender"
        value={passenger.gender}
        onChange={(e) => setPassenger({ ...passenger, gender: e.target.value })}
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>
    </Box>
  );
}