package com.travelease.repository;
import com.travelease.entity.Seat;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SeatRepository extends MongoRepository<Seat, String> {
    List<Seat> findByScheduleId(String scheduleId);
    List<Seat> findByScheduleIdAndBookedFalse(String scheduleId);
    List<Seat> findByScheduleIdAndSeatNumberIn(String scheduleId, List<String> seats);
}
