package com.travelease.repository;

import com.travelease.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    @Query("{ 'roles': ?0 }")
    List<User> findByRole(String role);
    
    List<User> findByRolesContaining(String role);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
}

