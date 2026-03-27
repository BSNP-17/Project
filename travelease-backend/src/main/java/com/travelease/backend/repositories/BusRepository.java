package com.travelease.backend.repositories;

import com.travelease.backend.models.Bus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BusRepository extends MongoRepository<Bus, String> {
    
    // Find all buses between two specific cities
    List<Bus> findByFromCityAndToCity(String fromCity, String toCity);
    
    // ✅ THE FIX: Spring Boot automatically translates "Between" into the correct MongoDB ISODate query.
    // This replaces your old @Query that was crashing due to the String vs Date mismatch.
    List<Bus> findByFromCityAndToCityAndDepartureTimeBetween(
            String fromCity, 
            String toCity, 
            LocalDateTime startOfDay, 
            LocalDateTime endOfDay
    );
    
    // Find buses by a specific operator (e.g., "VRL Travels")
    List<Bus> findByOperator(String operator);
}