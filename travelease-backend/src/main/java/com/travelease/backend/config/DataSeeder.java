package com.travelease.backend.config;

import com.travelease.backend.models.Bus;
import com.travelease.backend.models.User;
import com.travelease.backend.repositories.BusRepository;
import com.travelease.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private BusRepository busRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // 1. FIXED: Updated spellings to exactly match React frontend dropdowns
    private static final List<String> HUBS = Arrays.asList(
        "Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", 
        "Davangere", "Shimoga", "Udupi", "Goa", "Hyderabad"
    );

    // 2. CONNECTED TOWNS
    private static final List<String> DESTINATIONS = Arrays.asList(
        "Manipal", "Kukke Subramanya", "Dharmasthala", "Chikmagalur", "Coorg", "Madikeri",
        "Hassan", "Tumkur", "Chitradurga", "Bellary", "Raichur", "Bidar", "Bijapur", "Bagalkot",
        "Gadag", "Hospet", "Hampi", "Gokarna", "Karwar", "Sirsi", "Sringeri", "Horanadu",
        "Kundapura", "Murudeshwar", "Dandeli", "Badami"
    );

    // 3. OPERATORS
    private static final List<String> OPERATORS = Arrays.asList(
        "KSRTC (Airavat)", "KSRTC (Rajahamsa)", "KSRTC (Ambari Dream)",
        "VRL Travels", "SRS Travels", "Sugama Tourist", "Durgamba Motors",
        "Orange Tours", "Seabird Tourists", "Canara Pinto", "Reshma Travels", "IntrCity SmartBus"
    );

    // 4. BUS TYPES
    private static final List<String> TYPES = Arrays.asList(
        "AC Sleeper (2+1)", "Non-AC Seater (2+2)", "Volvo Multi-Axle AC", "Scania AC Semi-Sleeper", "Electric AC"
    );

    @Override
    public void run(String... args) {
        seedUsers();
        seedBuses();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setFullname("Admin User");
            admin.setEmail("admin@travelease.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(new HashSet<>(Collections.singletonList("ADMIN")));
            userRepository.save(admin);
            System.out.println("✅ DataSeeder: Admin Account Created.");
        }
    }

    private void seedBuses() {
        // 🚨 CRITICAL CHANGE: We now clear the old buses every time the server starts.
        // This ensures dates are always fresh and you never search for expired buses.
        busRepository.deleteAll();
        System.out.println("🧹 DataSeeder: Cleared old, expired buses.");

        System.out.println("🚀 DataSeeder: Generating comprehensive bus network...");
        List<Bus> buses = new ArrayList<>();
        
        // DYNAMIC DATES: Always starts from "Today" and goes 30 days into the future
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(30); 

        // Generate buses
        for (LocalDate date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
            for (String from : HUBS) {
                
                // Hub to Hub
                for (String to : HUBS) {
                    if (!from.equals(to)) {
                        buses.addAll(generateDailyBuses(date, from, to, 3));
                    }
                }

                // Hub to Destination
                for (String to : DESTINATIONS) {
                    buses.addAll(generateDailyBuses(date, from, to, 1)); // Reduced to 1 to save memory
                    buses.addAll(generateDailyBuses(date, to, from, 1));
                }
            }

            // Save in batches
            if (buses.size() > 1000) {
                busRepository.saveAll(buses);
                buses.clear();
            }
        }

        if (!buses.isEmpty()) {
            busRepository.saveAll(buses);
        }

        System.out.println("✅ DataSeeder: COMPLETE! Database populated with fresh schedules.");
    }

    private List<Bus> generateDailyBuses(LocalDate date, String from, String to, int count) {
        List<Bus> routeBuses = new ArrayList<>();
        ThreadLocalRandom random = ThreadLocalRandom.current();

        for (int i = 0; i < count; i++) {
            int hour;
            if (i == 0) hour = 6 + random.nextInt(4); // Morning
            else if (i == 1) hour = 19 + random.nextInt(4); // Night
            else hour = 12 + random.nextInt(6); // Afternoon
            
            int minute = random.nextBoolean() ? 0 : 30;
            LocalDateTime departure = LocalDateTime.of(date, LocalTime.of(hour, minute));
            
            boolean isLongDistance = HUBS.contains(from) && HUBS.contains(to);
            int durationHours = isLongDistance ? (7 + random.nextInt(5)) : (4 + random.nextInt(4));
            LocalDateTime arrival = departure.plusHours(durationHours);

            String operator = OPERATORS.get(random.nextInt(OPERATORS.size()));
            String type = TYPES.get(random.nextInt(TYPES.size()));

            double basePrice = isLongDistance ? 800 : 450;
            if (type.contains("AC")) basePrice += 300;
            if (type.contains("Sleeper")) basePrice += 250;
            double price = Math.round(basePrice / 10.0) * 10.0;

            Bus bus = new Bus();
            bus.setBusNumber("KA-" + (10 + random.nextInt(89)) + "-" + 
                            (char)('A' + random.nextInt(26)) + (char)('A' + random.nextInt(26)) + 
                            "-" + (1000 + random.nextInt(8999)));
            
            // Note: Make sure these setter names match your Bus.java model!
            bus.setOperator(operator); 
            bus.setFromCity(from);
            bus.setToCity(to);
            bus.setBusType(type);
            bus.setPrice(price);
            bus.setTotalSeats(30 + random.nextInt(20));
            bus.setAvailableSeats(bus.getTotalSeats());
            bus.setDepartureTime(departure);
            bus.setArrivalTime(arrival);
            
            List<String> amenities = new ArrayList<>(Arrays.asList("Water Bottle", "Charging Point"));
            if (type.contains("AC")) amenities.add("Reading Light");
            if (type.contains("Sleeper")) amenities.add("Blanket");
            if (type.contains("Volvo") || type.contains("SmartBus")) amenities.add("WiFi");
            bus.setAmenities(amenities);

            routeBuses.add(bus);
        }
        return routeBuses;
    }
}