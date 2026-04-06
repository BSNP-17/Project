package com.travelease.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    @Id private String id;
    private String email;
    private String password;
    private String fullname;
    private String phoneNumber; // ✅ Added phone number
    private Set<String> roles; // ["user", "admin"]
    private boolean enabled = true;
}