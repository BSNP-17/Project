package com.travelease.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BusResponse {
    private String id;
    private String busNumber;
    private String operatorName;
    private int totalSeats;
    private double rating;
    private List<String> scheduleIds;  // FIXED: Simple strings instead of nested DTO
}
