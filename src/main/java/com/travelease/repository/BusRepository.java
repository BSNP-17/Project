package com.travelease.repository;
import com.travelease.entity.Bus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface BusRepository extends MongoRepository<Bus, String> {
    List<Bus> findByOperator(String operator);
    Optional<Bus> findByBusNumber(String busNumber);
    List<Bus> findByBusType(String type);
}
