package com.travelease.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "reviews")
public class Review {
    @Id private String id;
    private String userId;
    private String userName; // Storing name for easier display
    private String busId;
    private int rating; // 1 to 5
    private String comment;
    private LocalDateTime date;
}