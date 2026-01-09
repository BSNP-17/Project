package com.travelease.repository;
import com.travelease.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByScheduleId(String scheduleId);
    List<Review> findByUserId(String userId);
}
