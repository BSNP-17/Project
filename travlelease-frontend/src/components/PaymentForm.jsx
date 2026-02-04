import React from "react";
import { TextField, MenuItem, Box } from "@mui/material";

export default function PaymentForm({ method, details, setDetails }) {
  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      {method === "card" && (
        <>
          <TextField
            fullWidth
            label="Card Number"
            value={details.cardNumber || ""}
            onChange={(e) => setDetails({ ...details, cardNumber: e.target.value })}
          />
          <TextField
            fullWidth
            label="CVV"
            type="password"
            value={details.cvv || ""}
            onChange={(e) => setDetails({ ...details, cvv: e.target.value })}
          />
        </>
      )}

      {method === "upi" && (
        <TextField
          fullWidth
          label="UPI ID"
          value={details.upiId || ""}
          onChange={(e) => setDetails({ ...details, upiId: e.target.value })}
        />
      )}

      {method === "netbanking" && (
        <TextField
          select
          fullWidth
          label="Select Bank"
          value={details.bank || ""}
          onChange={(e) => setDetails({ ...details, bank: e.target.value })}
        >
          <MenuItem value="SBI">SBI</MenuItem>
          <MenuItem value="HDFC">HDFC</MenuItem>
          <MenuItem value="ICICI">ICICI</MenuItem>
          <MenuItem value="Axis">Axis</MenuItem>
        </TextField>
      )}

      {method === "wallet" && (
        <TextField
          fullWidth
          label="Wallet ID"
          value={details.wallet || ""}
          onChange={(e) => setDetails({ ...details, wallet: e.target.value })}
        />
      )}
    </Box>
  );
}