package com.travelease.backend.services;

import com.travelease.backend.dto.BusRequest;
import com.travelease.backend.models.Bus;
import com.travelease.backend.repositories.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    public List<Bus> searchBuses(String from, String to, String date) {
        // 1. Convert the string date (e.g., "2026-04-05") into a LocalDate
        LocalDate localDate = LocalDate.parse(date);
        
        // 2. Create a 24-hour window for that specific day
        LocalDateTime startOfDay = localDate.atStartOfDay(); 
        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX); 

        // 3. Query MongoDB with Case-Insensitive cities and the date range
        List<Bus> buses = busRepository.findByFromCityIgnoreCaseAndToCityIgnoreCaseAndDepartureTimeBetween(
                from, 
                to, 
                startOfDay, 
                endOfDay
        );
        
        // 4. Final filter to ensure we only show buses with seats available
        return buses.stream()
                .filter(bus -> bus.getAvailableSeats() > 0)
                .collect(Collectors.toList());
    }

    public Bus addBus(BusRequest request) {
        Bus bus = new Bus();
        bus.setBusNumber(request.getBusNumber());
        bus.setOperator(request.getOperator());
        bus.setFromCity(request.getFromCity());
        bus.setToCity(request.getToCity());
        bus.setDepartureTime(request.getDepartureTime());
        bus.setArrivalTime(request.getArrivalTime());
        bus.setPrice(request.getPrice());
        bus.setTotalSeats(request.getTotalSeats());
        bus.setAvailableSeats(request.getTotalSeats());
        bus.setBusType(request.getBusType());
        bus.setAmenities(request.getAmenities());
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(String id) {
        return busRepository.findById(id).orElseThrow(() -> new RuntimeException("Bus not found"));
    }
}