package com.travelease.backend.controllers;

import com.travelease.backend.dto.BookingRequest;
import com.travelease.backend.dto.BookingResponse;
import com.travelease.backend.dto.CartCheckoutRequest;
import com.travelease.backend.models.Booking;
import com.travelease.backend.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ==========================================
    // 1. NEW: CART CHECKOUT ENDPOINT
    // ==========================================
    @PostMapping("/cart-checkout")
    public ResponseEntity<?> checkoutCart(@RequestBody CartCheckoutRequest request) {
        try {
            // Get the logged-in user's email securely from Spring Security
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            // Process the cart safely and get the list of receipts (BookingResponses)
            List<BookingResponse> completedBookings = bookingService.processCartCheckout(request, email);
            
            // Return the list of confirmed bookings
            return ResponseEntity.ok(completedBookings);
            
        } catch (RuntimeException e) {
            // If a seat was taken, return a 400 Bad Request with the error message
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred during checkout.");
        }
    }

    // ==========================================
    // 2. EXISTING INDIVIDUAL BOOKING ENDPOINTS
    // ==========================================
    
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            Booking booking = bookingService.createBooking(bookingRequest, email);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getUserBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(bookingService.getUserBookings(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}