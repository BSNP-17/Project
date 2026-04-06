package com.travelease.backend.controllers;

import com.travelease.backend.dto.DashboardStats;
import com.travelease.backend.models.Booking;
import com.travelease.backend.models.Bus;
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

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')") // Secures this endpoint!
    public ResponseEntity<DashboardStats> getDashboardStats() {
        long usersCount = userRepository.count();
        long busesCount = busRepository.count();
        long bookingsCount = bookingRepository.count();
        
        // Calculate Total Revenue from all bookings
        List<Booking> allBookings = bookingRepository.findAll();
        double totalRevenue = allBookings.stream()
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        return ResponseEntity.ok(new DashboardStats(usersCount, busesCount, bookingsCount, totalRevenue));
    }
    
    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }
    @GetMapping("/buses")
public ResponseEntity<List<Bus>> getAllBuses() {
    return ResponseEntity.ok(busRepository.findAll());
}

@PostMapping("/buses")
public ResponseEntity<Bus> addBus(@RequestBody Bus bus) {
    return ResponseEntity.ok(busRepository.save(bus));
}

@PutMapping("/buses/{id}")
public ResponseEntity<Bus> updateBus(@PathVariable String id, @RequestBody Bus bus) {
    bus.setId(id);
    return ResponseEntity.ok(busRepository.save(bus));
}

@DeleteMapping("/buses/{id}")
public ResponseEntity<Void> deleteBus(@PathVariable String id) {
    busRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}
}