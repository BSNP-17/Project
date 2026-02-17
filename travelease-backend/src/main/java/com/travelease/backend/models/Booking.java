package com.travelease.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id private String id;
    private String userId;
    private String busId;
    private String bookingId;
    private LocalDateTime bookingTime;
    private int seatsBooked;
    private double totalAmount;
    private String status; // PENDING, CONFIRMED, CANCELLED
    private String paymentId; 
    private List<String> passengerDetails;
    
    // 🔥 NEW: The specific seats for this ticket
    private List<String> seatNumbers; 
}