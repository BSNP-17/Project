package com.travelease.backend.dto;

import lombok.Data;

@Data
public class ResetPasswordOtpRequest {
    private String email;
    private String newPassword;
}
