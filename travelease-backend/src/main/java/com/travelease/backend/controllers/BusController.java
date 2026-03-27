package com.travelease.backend.controllers;

import com.travelease.backend.models.Bus;
import com.travelease.backend.repositories.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "*") // Allows your React frontend to communicate with this backend without CORS errors
public class BusController {

    @Autowired
    private BusRepository busRepository;

    /**
     * 1. SEARCH BUSES (Used by React BusResults.jsx)
     * Converts the LocalDate into a 24-hour window so MongoDB can match the exact ISODate timestamps.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Bus>> searchBuses(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            // Convert "2026-03-26" into "2026-03-26T00:00:00"
            LocalDateTime startOfDay = date.atStartOfDay();
            
            // Convert "2026-03-26" into "2026-03-26T23:59:59.999999999"
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

            // Fetch buses from MongoDB between those two times
            List<Bus> buses = busRepository.findByFromCityAndToCityAndDepartureTimeBetween(
                    from, to, startOfDay, endOfDay
            );

            return ResponseEntity.ok(buses);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 2. GET BUS BY ID (Used by React SeatSelection.jsx)
     * Loads specific bus details, price, and seat availability when a user clicks "Select Seats".
     */
    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable String id) {
        Optional<Bus> bus = busRepository.findById(id);
        
        if (bus.isPresent()) {
            return ResponseEntity.ok(bus.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 3. GET ALL BUSES (Admin Feature)
     * Returns every bus in the database.
     */
    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {
        try {
            List<Bus> allBuses = busRepository.findAll();
            return ResponseEntity.ok(allBuses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 4. CREATE A NEW BUS
     * Allows adding a bus manually.
     */
    @PostMapping
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
        try {
            // FIXED: Removed the '== null' check. 
            // Since availableSeats is a primitive 'int', it defaults to 0 when empty.
            if (bus.getAvailableSeats() == 0) {
                bus.setAvailableSeats(bus.getTotalSeats());
            }
            
            Bus savedBus = busRepository.save(bus);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBus);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}