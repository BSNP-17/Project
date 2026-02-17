package com.travelease.backend.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String fullname; 
    private String email;
    private String password;
}