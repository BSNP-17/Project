package com.travelease.backend.controllers;

import com.travelease.backend.dto.DashboardStats;
import com.travelease.backend.models.Booking;
import com.travelease.backend.models.Bus;
import com.travelease.backend.models.User;
import com.travelease.backend.repositories.BookingRepository;
import com.travelease.backend.repositories.BusRepository;
import com.travelease.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private BusRepository busRepository;
    @Autowired private BookingRepository bookingRepository;

    // ==================== DASHBOARD ====================

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        long usersCount = userRepository.count();
        long busesCount = busRepository.count();
        long bookingsCount = bookingRepository.count();
        double totalRevenue = bookingRepository.findAll().stream()
                .mapToDouble(Booking::getTotalAmount).sum();
        return ResponseEntity.ok(new DashboardStats(usersCount, busesCount, bookingsCount, totalRevenue));
    }

    // ==================== BUS MANAGEMENT ====================

    @GetMapping("/buses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busRepository.findAll());
    }

    @PostMapping("/buses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> addBus(@RequestBody Bus bus) {
        bus.setId(null); // Ensure new document
        return ResponseEntity.ok(busRepository.save(bus));
    }

    @PutMapping("/buses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> updateBus(@PathVariable String id, @RequestBody Bus bus) {
        bus.setId(id);
        return ResponseEntity.ok(busRepository.save(bus));
    }

    @DeleteMapping("/buses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBus(@PathVariable String id) {
        busRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BOOKING MANAGEMENT ====================

    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @DeleteMapping("/bookings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelBooking(@PathVariable String id) {
        bookingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
