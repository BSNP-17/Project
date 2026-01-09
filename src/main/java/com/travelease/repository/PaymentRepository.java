package com.travelease.repository;
import com.travelease.entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByBookingId(String bookingId);
    List<Payment> findByUserId(String userId);
    List<Payment> findByStatus(String status);
}
