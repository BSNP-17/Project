package com.travelease.backend.repositories;

import com.travelease.backend.models.Bus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusRepository extends MongoRepository<Bus, String> {
    List<Bus> findByFromCityAndToCity(String fromCity, String toCity);
    
    @Query("{ 'fromCity': ?0, 'toCity': ?1, 'departureTime': { $gte: ?2 } }")
    List<Bus> findAvailableBuses(String fromCity, String toCity, String departureDate);
    
    List<Bus> findByOperator(String operator);
}
