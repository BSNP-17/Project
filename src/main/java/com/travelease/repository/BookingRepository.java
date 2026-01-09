package com.travelease.repository;
import com.travelease.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByScheduleId(String scheduleId);
    List<Booking> findByUserIdAndStatus(String userId, String status);
}
