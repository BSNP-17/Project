package com.travelease.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "seats")
public class Seat {
    @Id private String id;
    private String scheduleId;
    private String seatNumber;
    private boolean booked = false;
    private String userId;  // if booked
}
