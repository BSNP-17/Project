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
@CrossOrigin(origins = "http://localhost:5173") 
public class BusController {

    @Autowired
    private BusRepository busRepository;

    @GetMapping("/search")
    public ResponseEntity<List<Bus>> searchBuses(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

            // UPDATED: Now uses the IgnoreCase method from repository
            List<Bus> buses = busRepository.findByFromCityIgnoreCaseAndToCityIgnoreCaseAndDepartureTimeBetween(
                    from, to, startOfDay, endOfDay
            );

            return ResponseEntity.ok(buses);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable String id) {
        return busRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
        try {
            if (bus.getAvailableSeats() == 0) {
                bus.setAvailableSeats(bus.getTotalSeats());
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(busRepository.save(bus));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}