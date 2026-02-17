package com.travelease.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    private String bookingId;
    private Double amount;
    private String paymentMethod;
    private String transactionId;
    private String status;
    private LocalDateTime paymentTime;
}
