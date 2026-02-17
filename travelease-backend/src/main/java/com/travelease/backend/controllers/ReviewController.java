package com.travelease.backend.controllers;

import com.travelease.backend.models.Review;
import com.travelease.backend.models.User;
import com.travelease.backend.repositories.ReviewRepository;
import com.travelease.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{busId}")
    public ResponseEntity<List<Review>> getBusReviews(@PathVariable String busId) {
        return ResponseEntity.ok(reviewRepository.findByBusId(busId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // We get the email from the token
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        review.setUserId(user.getId());
        review.setUserName(user.getFullname());
        review.setDate(LocalDateTime.now());
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}