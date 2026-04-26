package com.travelease.backend.services;

import com.travelease.backend.models.User;
import com.travelease.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ─── OTP: Generate a 6-digit code ─────────────────────────────────────────
    public String generateOtp() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    // ─── OTP: Store OTP + expiry on user, mark unverified ─────────────────────
    public void saveOtpForUser(User user, String otp) {
        user.setResetOtp(otp);
        user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setResetOtpVerified(false);
        userRepository.save(user);
    }

    // ─── OTP: Verify submitted OTP — returns true if valid, false otherwise ────
    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetOtp() == null || user.getResetOtpExpiry() == null) return false;
        if (LocalDateTime.now().isAfter(user.getResetOtpExpiry())) return false;
        if (!otp.equals(user.getResetOtp())) return false;

        user.setResetOtpVerified(true);
        userRepository.save(user);
        return true;
    }

    // ─── OTP: Reset password — only allowed after OTP verified ────────────────
    public void resetPasswordWithOtp(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (!user.isResetOtpVerified()) {
            throw new RuntimeException("OTP not verified. Cannot reset password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        // Clear OTP fields after successful reset
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        user.setResetOtpVerified(false);
        userRepository.save(user);
    }

    // ─── Legacy plain reset (kept for compatibility) ──────────────────────────
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
