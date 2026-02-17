package com.travelease.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private String busId;
    private List<String> passengerDetails; 
    
    // 🔥 NEW: List of selected seats (e.g., ["3", "4"])
    private List<String> seatNumbers; 
}