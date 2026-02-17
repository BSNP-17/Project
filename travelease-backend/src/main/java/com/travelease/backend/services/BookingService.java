package com.travelease.backend.services;

import com.travelease.backend.dto.BookingRequest;
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
        // Find by PNR (bookingId)
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Booking not found"));

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
        Booking booking = getBookingById(bookingId); // Use smart lookup

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

    public List<Booking> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId());
    }
    
    // ✅ FIXED: Support lookup by both MongoID and PNR (BookingID)
    public Booking getBookingById(String id) {
        // 1. Try finding by PNR (Booking ID) first
        Booking byPnr = bookingRepository.findByBookingId(id).stream().findFirst().orElse(null);
        if (byPnr != null) {
            return byPnr;
        }

        // 2. Fallback to Database ID
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID/PNR: " + id));
    }
}