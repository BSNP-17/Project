package com.travelease.entity;
import lombok.Data; 
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "routes")
public class Route {
    @Id private String id;
    private String fromCity;
    private String toCity;
    private double distanceKm;
    private String duration;  // "4h 30m"
}

