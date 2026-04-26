package com.travelease.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("TravelEase - Your Password Reset OTP");
        message.setText(
            "Hello,\n\n" +
            "Your OTP for resetting your TravelEase password is:\n\n" +
            "    " + otp + "\n\n" +
            "This OTP is valid for 5 minutes. Do not share it with anyone.\n\n" +
            "If you did not request a password reset, please ignore this email.\n\n" +
            "— TravelEase Team"
        );
        mailSender.send(message);
    }
}
