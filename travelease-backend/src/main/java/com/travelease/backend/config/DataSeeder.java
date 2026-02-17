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

    // 1. EXPANDED MAJOR HUBS (Includes Metros for Trending Routes)
    private static final List<String> HUBS = Arrays.asList(
        "Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum", 
        "Chennai", "Mumbai", "Pune", "Goa", "Hyderabad"
    );

    // 2. CONNECTED TOWNS (The Network)
    private static final List<String> DESTINATIONS = Arrays.asList(
        "Udupi", "Manipal", "Kukke Subramanya", "Dharmasthala", "Chikmagalur", "Coorg", "Madikeri",
        "Hassan", "Tumkur", "Chitradurga", "Bellary", "Raichur", "Bidar", "Bijapur", "Bagalkot",
        "Gadag", "Hospet", "Hampi", "Gokarna", "Karwar", "Sirsi", "Sringeri", "Horanadu",
        "Kolar", "Mandya", "Chamarajanagar", "Ramanagara", "Chikkaballapur", "Haveri",
        "Bhatkal", "Kundapura", "Murudeshwar", "Dandeli", "Badami", "Pattadakal", "Aihole"
    );

    // 3. OPERATORS
    private static final List<String> OPERATORS = Arrays.asList(
        "KSRTC (Airavat)", "KSRTC (Rajahamsa)", "KSRTC (Ambari Dream Class)",
        "VRL Travels", "SRS Travels", "Sugama Tourists", "Durgamba Motors",
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
        // Since you deleted the DB, this will run freshly
        if (busRepository.count() > 0) {
            System.out.println("⚡ DataSeeder: Buses already exist. Skipping.");
            return;
        }

        System.out.println("🚀 DataSeeder: Generating comprehensive bus network...");
        List<Bus> buses = new ArrayList<>();
        
        // DYNAMIC DATES: Always starts from "Today" when the server restarts/runs
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(45); // Generate for next 45 days

        // LOOP 1: Iterate through every single day
        for (LocalDate date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
            
            // LOOP 2: Iterate through every HUB (Source)
            for (String from : HUBS) {
                
                // SUB-LOOP A: Connect Hub to every other Hub (Major Routes)
                for (String to : HUBS) {
                    if (!from.equals(to)) {
                        // Generate 3 buses per day for Hub-to-Hub
                        buses.addAll(generateDailyBuses(date, from, to, 3));
                    }
                }

                // SUB-LOOP B: Connect Hub to every Destination (Town Routes)
                for (String to : DESTINATIONS) {
                    // Generate 2 buses per day for Hub-to-Town
                    buses.addAll(generateDailyBuses(date, from, to, 2));
                    
                    // Generate 2 buses per day for Town-to-Hub (Return journey)
                    buses.addAll(generateDailyBuses(date, to, from, 2));
                }
            }

            // Save in batches to prevent memory overflow
            if (buses.size() > 2000) {
                busRepository.saveAll(buses);
                buses.clear();
                System.out.println("... Batch saved for date: " + date);
            }
        }

        // Save remaining
        if (!buses.isEmpty()) {
            busRepository.saveAll(buses);
        }

        System.out.println("✅ DataSeeder: COMPLETE! Database populated with dense schedules.");
    }

    // Helper to generate 'count' buses for a specific Route on a specific Date
    private List<Bus> generateDailyBuses(LocalDate date, String from, String to, int count) {
        List<Bus> routeBuses = new ArrayList<>();
        ThreadLocalRandom random = ThreadLocalRandom.current();

        for (int i = 0; i < count; i++) {
            // Distribute times: Morning, Afternoon, Night
            int hour;
            if (i == 0) hour = 6 + random.nextInt(4); // Morning (6-10 AM)
            else if (i == 1) hour = 19 + random.nextInt(4); // Night (7-11 PM)
            else hour = 12 + random.nextInt(6); // Afternoon (12-6 PM)
            
            int minute = random.nextBoolean() ? 0 : 30;
            LocalDateTime departure = LocalDateTime.of(date, LocalTime.of(hour, minute));
            
            // Duration varies by distance type (Mock logic)
            boolean isLongDistance = HUBS.contains(from) && HUBS.contains(to);
            int durationHours = isLongDistance ? (7 + random.nextInt(5)) : (4 + random.nextInt(4));
            LocalDateTime arrival = departure.plusHours(durationHours);

            // Random Details
            String operator = OPERATORS.get(random.nextInt(OPERATORS.size()));
            String type = TYPES.get(random.nextInt(TYPES.size()));

            // Price Calculation
            double basePrice = isLongDistance ? 800 : 450;
            if (type.contains("AC")) basePrice += 300;
            if (type.contains("Sleeper")) basePrice += 250;
            double price = Math.round(basePrice / 10.0) * 10.0;

            Bus bus = new Bus();
            // Unique Bus Number
            bus.setBusNumber("KA-" + (10 + random.nextInt(89)) + "-" + 
                            (char)('A' + random.nextInt(26)) + (char)('A' + random.nextInt(26)) + 
                            "-" + (1000 + random.nextInt(8999)));
            bus.setOperator(operator);
            bus.setFromCity(from);
            bus.setToCity(to);
            bus.setBusType(type);
            bus.setPrice(price);
            bus.setTotalSeats(30 + random.nextInt(20));
            bus.setAvailableSeats(bus.getTotalSeats()); // Starts empty
            bus.setDepartureTime(departure);
            bus.setArrivalTime(arrival);
            
            // Amenities
            List<String> amenities = new ArrayList<>(Arrays.asList("Water Bottle", "Charging Point"));
            if (type.contains("AC")) amenities.add("Reading Light");
            if (type.contains("Sleeper")) amenities.add("Blanket");
            if (type.contains("Volvo") || type.contains("SmartBus")) amenities.add("WiFi");
            if (type.contains("Scania")) amenities.add("Movie System");
            bus.setAmenities(amenities);

            routeBuses.add(bus);
        }
        return routeBuses;
    }
}