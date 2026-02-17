package com.travelease.backend.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String bookingId;
    private Double amount;
    private String paymentMethod; // e.g., "Credit Card", "UPI"
    private String cardNumber;    // For simulation
    private String upiId;         // For simulation
}