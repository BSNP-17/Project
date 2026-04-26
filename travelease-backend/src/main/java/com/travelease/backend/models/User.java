package com.travelease.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    @Id private String id;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String fullname;
    private String phoneNumber;
    private Set<String> roles; // ["USER", "ADMIN"]
    private boolean enabled = true;

    // ─── OTP Forgot Password fields ──────────────────────────────────────────────────
    private String resetOtp;              // Hashed 6-digit OTP (use BCrypt)
    private LocalDateTime resetOtpExpiry; // OTP expires 5 min after generation
    private boolean resetOtpVerified;     // true only after user enters correct OTP
}
