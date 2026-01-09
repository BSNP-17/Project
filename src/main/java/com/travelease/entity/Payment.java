package com.travelease.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "payments")
public class Payment {
    @Id private String id;
    private String bookingId;
    private String userId;
    private double amount;
    private String paymentMethod;  // UPI/CARD
    private String transactionId;
    private String status = "SUCCESS";
    private String paymentDate;
}
