package com.travelease.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponse {
    private String id;
    private String bookingId;   // PNR
    private String busName;     // Operator
    private String source;      
    private String destination; 
    private String busType;
    private LocalDateTime bookingTime; 
    private LocalDateTime departureTime; // Journey Start
    private LocalDateTime arrivalTime;   // Journey End (New Field)
    private List<String> seatNumbers;
    private double totalAmount;
    private String status;
}