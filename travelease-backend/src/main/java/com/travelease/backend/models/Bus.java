package com.travelease.backend.models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotBlank(message = "Operator name is required")
    private String operator;

    @NotBlank(message = "Origin city is required")
    private String fromCity;

    @NotBlank(message = "Destination city is required")
    private String toCity;

    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrivalTime;

    @Min(value = 0, message = "Price must be non-negative")
    private double price;

    @Min(value = 1, message = "Total seats must be at least 1")
    private int totalSeats;

    @Min(value = 0, message = "Available seats cannot be negative")
    private int availableSeats;

    @NotBlank(message = "Bus type is required (AC / Non-AC / Sleeper)")
    private String busType;

    private List<String> amenities;

    // Tracks specific booked seat numbers e.g. ["1A", "2B"]
    private List<String> bookedSeats = new ArrayList<>();
}
