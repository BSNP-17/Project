package com.travelease.repository;
import com.travelease.entity.Refund;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RefundRepository extends MongoRepository<Refund, String> {
    Optional<Refund> findByBookingId(String bookingId);
    List<Refund> findByStatus(String status);
}
