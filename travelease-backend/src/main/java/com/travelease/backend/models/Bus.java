package com.travelease.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "buses")
public class Bus {
    @Id private String id;
    private String busNumber;
    private String operator;
    private String fromCity;
    private String toCity;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double price;
    private int totalSeats;
    private int availableSeats;
    private String busType; // AC, Non-AC, Sleeper
    private List<String> amenities;
    
    // 🔥 NEW: Tracks specific seat numbers like ["1A", "2B"]
    private List<String> bookedSeats = new ArrayList<>(); 
}