package com.travelease.backend.repositories;

import com.travelease.backend.models.Bus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BusRepository extends MongoRepository<Bus, String> {
    
    // The "Golden" method: Handles Case-Insensitivity and Date Range in one go
    List<Bus> findByFromCityIgnoreCaseAndToCityIgnoreCaseAndDepartureTimeBetween(
            String fromCity, 
            String toCity, 
            LocalDateTime startOfDay, 
            LocalDateTime endOfDay
    );

    List<Bus> findByOperator(String operator);
}