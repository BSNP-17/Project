package com.travelease.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "refunds")
public class Refund {
    @Id private String id;
    private String bookingId;
    private String paymentId;
    private double amount;
    private String reason;
    private String status = "PENDING";
    private String requestDate;
}
