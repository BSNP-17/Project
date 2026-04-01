package com.travelease.backend.services;

import com.travelease.backend.dto.BookingRequest;
import com.travelease.backend.dto.BookingResponse;
import com.travelease.backend.dto.CartCheckoutRequest;
import com.travelease.backend.dto.CartItemDto;
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

    // --- CART CHECKOUT LOGIC ---
    
    @Transactional
    public List<BookingResponse> processCartCheckout(CartCheckoutRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // STEP 1: Verify all seats in the cart are still available
        for (CartItemDto item : request.getCartItems()) {
            Bus bus = busRepository.findById(item.getBusId())
                    .orElseThrow(() -> new RuntimeException("Bus not found"));

            if (bus.getAvailableSeats() < item.getSelectedSeats().size()) {
                throw new RuntimeException("Not enough seats available for bus: " + bus.getOperator());
            }

            List<String> alreadyBooked = bus.getBookedSeats() != null ? bus.getBookedSeats() : new ArrayList<>();
            for (String seat : item.getSelectedSeats()) {
                if (alreadyBooked.contains(seat)) {
                    throw new RuntimeException("Seat " + seat + " on bus " + bus.getOperator() + " was just booked by someone else!");
                }
            }
        }

        // STEP 2: All seats are available -> Process Bookings
        List<BookingResponse> completedBookings = new ArrayList<>();
        
        for (CartItemDto item : request.getCartItems()) {
            Bus bus = busRepository.findById(item.getBusId()).get();

            // 1. Update Bus Inventory
            bus.setAvailableSeats(bus.getAvailableSeats() - item.getSelectedSeats().size());
            List<String> bookedSeats = bus.getBookedSeats() != null ? bus.getBookedSeats() : new ArrayList<>();
            bookedSeats.addAll(item.getSelectedSeats());
            bus.setBookedSeats(bookedSeats);
            busRepository.save(bus);

            // 2. Create Booking Record
            Booking booking = new Booking();
            booking.setUserId(user.getId());
            booking.setBusId(bus.getId());
            booking.setBookingId(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            booking.setBookingTime(LocalDateTime.now());
            booking.setSeatsBooked(item.getSelectedSeats().size());
            
            // ✅ FIXED: Using setSeatNumbers instead of setSeats
            booking.setSeatNumbers(item.getSelectedSeats());
            booking.setTotalAmount(item.getTotalPrice());
            booking.setStatus("CONFIRMED"); // Automatically confirmed for cart checkout
            booking.setPaymentId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()); // Mock Txn ID
            
            Booking savedBooking = bookingRepository.save(booking);
            completedBookings.add(mapToResponse(savedBooking));
        }

        return completedBookings;
    }

    // --- INDIVIDUAL BOOKING LOGIC ---

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

    public BookingResponse getBookingById(String id) {
        Booking booking = findBookingEntity(id);
        return mapToResponse(booking);
    }

    private Booking findBookingEntity(String id) {
        Booking booking = bookingRepository.findByBookingId(id)
                .stream().findFirst()
                .orElse(null);

        if (booking == null) {
            booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID/PNR: " + id));
        }
        return booking;
    }

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