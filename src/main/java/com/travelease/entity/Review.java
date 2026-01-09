package com.travelease.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "reviews")
public class Review {
    @Id private String id;
    private String userId;
    private String scheduleId;
    private int rating;  // 1-5
    private String comment;
    private String reviewDate;
}
