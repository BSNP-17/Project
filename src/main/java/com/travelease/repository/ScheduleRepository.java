package com.travelease.repository;
import com.travelease.entity.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ScheduleRepository extends MongoRepository<Schedule, String> {
    List<Schedule> findByRouteIdAndDepartureDateGreaterThanEqual(String routeId, String date);
    List<Schedule> findByRouteId(String routeId);
    List<Schedule> findByDepartureDateGreaterThanEqual(String date);
}
