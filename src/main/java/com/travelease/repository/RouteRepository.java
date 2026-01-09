package com.travelease.repository;
import com.travelease.entity.Route;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RouteRepository extends MongoRepository<Route, String> {
    List<Route> findByFromCityAndToCity(String from, String to);
    List<Route> findByFromCity(String city);
}
