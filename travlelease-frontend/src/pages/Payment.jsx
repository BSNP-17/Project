import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import PaymentForm from "../components/PaymentForm";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const [method, setMethod] = useState("card");
  const [details, setDetails] = useState({});
  const [error, setError] = useState("");

  const handlePayment = () => {
    if (method === "card" && (!details.cardNumber || !details.cvv)) {
      setError("Please enter valid card details.");
      return;
    }
    if (method === "upi" && !details.upiId) {
      setError("Please enter a valid UPI ID.");
      return;
    }
    if (method === "netbanking" && !details.bank) {
      setError("Please select a bank.");
      return;
    }

    // Mock payment success
    navigate("/confirmation", { state: { bookingId } });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}

        <RadioGroup
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
            setDetails({});
            setError("");
          }}
        >
          <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
          <FormControlLabel value="upi" control={<Radio />} label="UPI" />
          <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
          <FormControlLabel value="wallet" control={<Radio />} label="Wallet" />
        </RadioGroup>

        <Box sx={{ mt: 3 }}>
          {method === "card" && (
            <>
              <TextField
                fullWidth
                label="Card Number"
                value={details.cardNumber || ""}
                onChange={(e) => setDetails({ ...details, cardNumber: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="CVV"
                type="password"
                value={details.cvv || ""}
                onChange={(e) => setDetails({ ...details, cvv: e.target.value })}
                sx={{ mb: 2 }}
              />
            </>
          )}

          {method === "upi" && (
            <TextField
              fullWidth
              label="UPI ID"
              value={details.upiId || ""}
              onChange={(e) => setDetails({ ...details, upiId: e.target.value })}
              sx={{ mb: 2 }}
            />
          )}

          {method === "netbanking" && (
            <TextField
              fullWidth
              label="Bank Name"
              value={details.bank || ""}
              onChange={(e) => setDetails({ ...details, bank: e.target.value })}
              sx={{ mb: 2 }}
            />
          )}

          {method === "wallet" && (
            <TextField
              fullWidth
              label="Wallet ID"
              value={details.wallet || ""}
              onChange={(e) => setDetails({ ...details, wallet: e.target.value })}
              sx={{ mb: 2 }}
            />
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handlePayment}
        >
          Pay Now
        </Button>
      </Paper>
    </Container>
  );
}