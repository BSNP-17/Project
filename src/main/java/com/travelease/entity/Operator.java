package com.travelease.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "operators")
public class Operator {
    @Id private String id;
    private String name;
    private String contact;
    private String licenseNumber;
}
