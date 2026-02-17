package com.travelease.backend.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String fullname;
    private Set<String> roles;

    public UserResponse(String id, String email, String fullname, Set<String> roles) {
        this.id = id;
        this.email = email;
        this.fullname = fullname;
        this.roles = roles;
    }
}