package com.travelease.backend.controllers;

import com.travelease.backend.dto.LoginRequest;
import com.travelease.backend.dto.SignupRequest;
import com.travelease.backend.dto.JwtResponse;
import com.travelease.backend.models.User;
import com.travelease.backend.security.UserDetailsImpl;
import com.travelease.backend.security.JwtService;
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
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            // Check if email already exists
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Error: Email is already in use!");
            }

            // Create and populate new User object
            User user = new User();
            user.setFullname(request.getFullname());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            // Encrypt the password before saving
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            // Set default roles
            user.setRoles(new HashSet<>(Collections.singletonList("USER"))); 
            
            userService.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
            
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. Authenticate user using Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            // 2. Set authentication context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 3. Generate JWT Token
            String jwt = jwtService.generateToken(authentication);
            
            // 4. Extract User details
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
            
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // 5. Return Token and Profile info
            return ResponseEntity.ok(new JwtResponse(
                    jwt, 
                    userDetails.getId(), 
                    userDetails.getEmail(), 
                    userDetails.getFullname(), 
                    userDetails.getPhoneNumber(), 
                    roles
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication error: " + e.getMessage());
        }
    }
}