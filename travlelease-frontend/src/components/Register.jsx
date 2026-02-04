import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import axios from "../axiosConfig";

export default function Register({ setToken }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/register", formData);
      const token = response.data.token;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setError("");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Button type="submit" fullWidth variant="contained">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}