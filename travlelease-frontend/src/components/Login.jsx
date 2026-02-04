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

export default function Login({ setToken }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", formData);
      const token = response.data.token;

      // Save token locally
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setError("");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
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
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}