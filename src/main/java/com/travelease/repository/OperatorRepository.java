package com.travelease.repository;
import com.travelease.entity.Operator;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OperatorRepository extends MongoRepository<Operator, String> {
    Optional<Operator> findByName(String name);
    Optional<Operator> findByLicenseNumber(String license);
}
