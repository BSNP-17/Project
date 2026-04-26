package com.travelease.backend.controllers;

import com.travelease.backend.dto.*;
import com.travelease.backend.models.User;
import com.travelease.backend.security.UserDetailsImpl;
import com.travelease.backend.security.JwtService;
import com.travelease.backend.services.EmailService;
import com.travelease.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
// NOTE: Global CORS is configured in SecurityConfig. @CrossOrigin removed to avoid conflicts.
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ─── SIGNUP ────────────────────────────────────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Error: Email is already in use!");
            }
            User user = new User();
            user.setFullname(request.getFullname());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRoles(new HashSet<>(Collections.singletonList("USER")));
            userService.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during registration: " + e.getMessage());
        }
    }

    // ─── LOGIN ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateToken(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new JwtResponse(
                    jwt, userDetails.getId(), userDetails.getEmail(),
                    userDetails.getFullname(), userDetails.getPhoneNumber(), roles
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication error: " + e.getMessage());
        }
    }

    // ─── OTP STEP 1: Send OTP to email ────────────────────────────────────────────────────
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody ForgotPasswordRequest request) {
        try {
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String otp = userService.generateOtp();
            userService.saveOtpForUser(user, otp);
            emailService.sendOtpEmail(user.getEmail(), otp);
            return ResponseEntity.ok("OTP sent to your email address");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No account found with this email address");
        }
    }

    // ─── OTP STEP 2: Verify OTP ─────────────────────────────────────────────────────────────
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean valid = userService.verifyOtp(request.getEmail(), request.getOtp());
        if (valid) {
            return ResponseEntity.ok("OTP verified successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid or expired OTP. Please try again.");
    }

    // ─── OTP STEP 3: Reset password after OTP verified ─────────────────────────────────────
    @PutMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPasswordWithOtp(@RequestBody ResetPasswordOtpRequest request) {
        try {
            userService.resetPasswordWithOtp(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ─── Legacy: check-email (kept for compatibility) ──────────────────────────────────────
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        if (userService.existsByEmail(email)) {
            return ResponseEntity.ok("Email exists");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No account found with this email");
    }

    // ─── Legacy: direct reset-password ──────────────────────────────────────────────────────
    // SECURITY: This endpoint now verifies the OTP was already confirmed before allowing reset.
    // Use the /forgot-password/send-otp → /verify-otp → /forgot-password/reset flow instead.
    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            // Guard: Require OTP verification before allowing password reset
            if (!userService.isOtpVerified(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("OTP verification required before resetting password.");
            }
            if (!userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No account found with this email");
            }
            userService.resetPassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error resetting password: " + e.getMessage());
        }
    }
}
