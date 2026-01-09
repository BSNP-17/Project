package com.travelease.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id private String id;
    private String userId;
    private String scheduleId;
    private List<String> seatNumbers;
    private double totalAmount;
    private String status = "CONFIRMED";  // CONFIRMED/CANCELLED
    private String bookingDate;
}
