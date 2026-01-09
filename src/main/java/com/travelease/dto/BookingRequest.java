package com.travelease.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {
    private String userId;
    private String scheduleId;
    private List<String> seatIds;
    private LocalDate travelDate;
    private String paymentId;
}
