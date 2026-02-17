package com.travelease.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BusRequest {
    private String busNumber;
    private String operator;
    private String fromCity;
    private String toCity;
    private String busType;
    private double price;
    private int totalSeats;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private List<String> amenities;
}