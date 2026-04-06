package com.travelease.backend.dto;
import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String email;
    private String fullname;    // ✅ Added field
    private String phoneNumber; // ✅ Added field
    private List<String> roles;

    // Update the constructor
    public JwtResponse(String accessToken, String id, String email, String fullname, String phoneNumber, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.fullname = fullname;       // ✅ Added
        this.phoneNumber = phoneNumber; // ✅ Added
        this.roles = roles;
    }
}