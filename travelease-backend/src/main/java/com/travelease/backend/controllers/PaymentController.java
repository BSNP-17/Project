package com.travelease.backend.controllers;

import com.travelease.backend.dto.PaymentRequest;
import com.travelease.backend.dto.PaymentResponse;
import com.travelease.backend.models.Payment;
import com.travelease.backend.repositories.PaymentRepository;
import com.travelease.backend.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingService bookingService;

    @PostMapping("/process")
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest request) {
        try {
            // Simulate bank delay
            Thread.sleep(1000); 
            
            Payment payment = new Payment();
            payment.setBookingId(request.getBookingId());
            payment.setAmount(request.getAmount());
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setStatus("SUCCESS");
            payment.setTransactionId(UUID.randomUUID().toString());
            payment.setPaymentTime(LocalDateTime.now());
            paymentRepository.save(payment);

            // Confirm the booking using the service
            bookingService.confirmBooking(request.getBookingId(), payment.getTransactionId());

            return ResponseEntity.ok(new PaymentResponse("SUCCESS", payment.getTransactionId(), "Payment processed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new PaymentResponse("FAILED", null, e.getMessage()));
        }
    }
}