package com.travelease.backend.repositories;

import com.travelease.backend.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByBusId(String busId);
    List<Booking> findByBookingId(String bookingId);
}
