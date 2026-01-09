package com.travelease.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponse {
    private String id;
    private String userId;
    private String scheduleId;
    private List<String> seats;
    private double totalAmount;
    private String status;
    private LocalDateTime bookedAt;
}
