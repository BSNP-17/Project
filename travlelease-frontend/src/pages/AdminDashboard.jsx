import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../axiosConfig";

export default function AdminDashboard() {
  const [buses, setBuses] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    departure: "",
    arrival: "",
    price: "",
  });
  const [error, setError] = useState("");

  // Fetch buses
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get("/api/buses");
        setBuses(response.data);
      } catch (err) {
        setError("Failed to load buses.");
      }
    };
    fetchBuses();
  }, []);

  // Handle Add/Edit
  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/api/buses/${formData.id}`, formData);
      } else {
        await axios.post("/api/buses", formData);
      }
      setOpen(false);
      setFormData({ name: "", type: "", departure: "", arrival: "", price: "" });
      const response = await axios.get("/api/buses");
      setBuses(response.data);
    } catch (err) {
      setError("Operation failed.");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/buses/${id}`);
      setBuses(buses.filter((bus) => bus.id !== id));
    } catch (err) {
      setError("Delete failed.");
    }
  };

  const columns = [
    { field: "name", headerName: "Bus Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "departure", headerName: "Departure", flex: 1 },
    { field: "arrival", headerName: "Arrival", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setFormData(params.row);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ height: 400, mt: 2 }}>
        <DataGrid rows={buses} columns={columns} getRowId={(row) => row.id} />
      </Paper>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => setOpen(true)}
      >
        Add Bus
      </Button>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{formData.id ? "Edit Bus" : "Add Bus"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Bus Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <TextField
            label="Departure"
            value={formData.departure}
            onChange={(e) =>
              setFormData({ ...formData, departure: e.target.value })
            }
          />
          <TextField
            label="Arrival"
            value={formData.arrival}
            onChange={(e) =>
              setFormData({ ...formData, arrival: e.target.value })
            }
          />
          <TextField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}