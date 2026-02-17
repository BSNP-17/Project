package com.travelease.backend.services;

import com.travelease.backend.dto.BookingRequest;
import com.travelease.backend.dto.BookingResponse;
import com.travelease.backend.models.Booking;
import com.travelease.backend.models.Bus;
import com.travelease.backend.models.User;
import com.travelease.backend.repositories.BookingRepository;
import com.travelease.backend.repositories.BusRepository;
import com.travelease.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private BusRepository busRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Booking createBooking(BookingRequest request, String userEmail) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int seatsNeeded = request.getPassengerDetails().size();

        if (bus.getAvailableSeats() < seatsNeeded) {
            throw new RuntimeException("Not enough seats available!");
        }

        if (request.getSeatNumbers() != null) {
            List<String> alreadyBooked = bus.getBookedSeats() != null ? bus.getBookedSeats() : new ArrayList<>();
            for (String seat : request.getSeatNumbers()) {
                if (alreadyBooked.contains(seat)) {
                    throw new RuntimeException("Seat " + seat + " is already booked by someone else!");
                }
            }
        }

        Booking booking = new Booking();
        booking.setUserId(user.getId());
        booking.setBusId(bus.getId());
        booking.setBookingId(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setBookingTime(LocalDateTime.now());
        booking.setSeatsBooked(seatsNeeded);
        booking.setPassengerDetails(request.getPassengerDetails());
        booking.setSeatNumbers(request.getSeatNumbers());
        booking.setTotalAmount(bus.getPrice() * seatsNeeded);
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking confirmBooking(String bookingId, String transactionId) {
        // ✅ FIXED: Use helper method to get Entity
        Booking booking = findBookingEntity(bookingId);

        if (!"PENDING".equals(booking.getStatus())) {
            return booking; 
        }

        Bus bus = busRepository.findById(booking.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        if (bus.getAvailableSeats() < booking.getSeatsBooked()) {
            throw new RuntimeException("Booking expired: Seats no longer available");
        }
        
        if (booking.getSeatNumbers() != null) {
            List<String> currentBooked = bus.getBookedSeats() != null ? bus.getBookedSeats() : new ArrayList<>();
            currentBooked.addAll(booking.getSeatNumbers());
            bus.setBookedSeats(currentBooked);
        }

        bus.setAvailableSeats(bus.getAvailableSeats() - booking.getSeatsBooked());
        busRepository.save(bus);

        booking.setStatus("CONFIRMED");
        booking.setPaymentId(transactionId);
        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(String bookingId) {
        // ✅ FIXED: Now calls findBookingEntity() which returns the Booking object (not DTO)
        Booking booking = findBookingEntity(bookingId); 

        if ("CONFIRMED".equals(booking.getStatus())) {
            Bus bus = busRepository.findById(booking.getBusId())
                    .orElseThrow(() -> new RuntimeException("Bus not found"));
            
            bus.setAvailableSeats(bus.getAvailableSeats() + booking.getSeatsBooked());
            
            if (booking.getSeatNumbers() != null && bus.getBookedSeats() != null) {
                bus.getBookedSeats().removeAll(booking.getSeatNumbers());
            }
            
            busRepository.save(bus);
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    // --- READ OPERATIONS ---

    public List<BookingResponse> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Booking> bookings = bookingRepository.findByUserId(user.getId());
        
        return bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Public method for Controller (Returns DTO)
    public BookingResponse getBookingById(String id) {
        Booking booking = findBookingEntity(id);
        return mapToResponse(booking);
    }

    // ✅ NEW HELPER METHOD: Returns the Booking Entity (for internal logic)
    private Booking findBookingEntity(String id) {
        // 1. Try finding by PNR first
        Booking booking = bookingRepository.findByBookingId(id)
                .stream().findFirst()
                .orElse(null);

        // 2. If not found, try by DB ID
        if (booking == null) {
            booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID/PNR: " + id));
        }
        return booking;
    }

    // Mapper Method
    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        
        response.setId(booking.getId());
        response.setBookingId(booking.getBookingId());
        response.setBookingTime(booking.getBookingTime());
        response.setSeatNumbers(booking.getSeatNumbers());
        response.setTotalAmount(booking.getTotalAmount());
        response.setStatus(booking.getStatus());

        busRepository.findById(booking.getBusId()).ifPresent(bus -> {
            response.setBusName(bus.getOperator());
            response.setSource(bus.getFromCity());
            response.setDestination(bus.getToCity());
            response.setBusType(bus.getBusType());
            response.setDepartureTime(bus.getDepartureTime());
            response.setArrivalTime(bus.getArrivalTime());
        });

        return response;
    }
}