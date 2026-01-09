package com.travelease.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ScheduleResponse {
    private String id;
    private String routeId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double price;
    private int availableSeats;
}
