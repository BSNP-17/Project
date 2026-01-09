package com.travelease.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "buses")
public class Bus {
    @Id private String id;
    private String busNumber;
    private String operator;
    private int totalSeats;
    private String busType;  // AC/Sleeper
    private String amenities;  // JSON array
}
