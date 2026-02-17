package com.travelease.backend.services;

import com.travelease.backend.dto.BusRequest;
import com.travelease.backend.models.Bus;
import com.travelease.backend.repositories.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

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

    public List<Bus> searchBuses(String from, String to, String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<Bus> buses = busRepository.findByFromCityAndToCity(from, to);
        
        return buses.stream()
                .filter(bus -> bus.getDepartureTime().toLocalDate().equals(localDate))
                .filter(bus -> bus.getAvailableSeats() > 0)
                .collect(Collectors.toList());
    }
}