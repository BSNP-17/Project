package com.travelease.backend.config;

import com.travelease.backend.models.Bus;
import com.travelease.backend.models.User;
import com.travelease.backend.repositories.BusRepository;
import com.travelease.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    // =====================================================
    //   Admin credentials loaded from application.properties
    //   Override using environment variables:
    //     ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE
    // =====================================================
    @Value("${travelease.admin.fullname}")
    private String adminFullname;

    @Value("${travelease.admin.email}")
    private String adminEmail;

    @Value("${travelease.admin.phone}")
    private String adminPhone;

    @Value("${travelease.admin.password}")
    private String adminPasswordRaw;
    // =====================================================

    private static final List<String> HUBS = Arrays.asList(
        "Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi",
        "Davangere", "Shimoga", "Udupi", "Goa", "Hyderabad"
    );

    private static final List<String> DESTINATIONS = Arrays.asList(
        "Manipal", "Kukke Subramanya", "Dharmasthala", "Chikmagalur", "Coorg", "Madikeri",
        "Hassan", "Tumkur", "Chitradurga", "Bellary", "Raichur", "Bidar", "Bijapur", "Bagalkot",
        "Gadag", "Hospet", "Hampi", "Gokarna", "Karwar", "Sirsi", "Sringeri", "Horanadu",
        "Kundapura", "Murudeshwar", "Dandeli", "Badami"
    );

    private static final List<String> OPERATORS = Arrays.asList(
        "KSRTC (Airavat)", "KSRTC (Rajahamsa)", "KSRTC (Ambari Dream)",
        "VRL Travels", "SRS Travels", "Sugama Tourist", "Durgamba Motors",
        "Orange Tours", "Seabird Tourists", "Canara Pinto", "Reshma Travels", "IntrCity SmartBus"
    );

    private static final List<String> TYPES = Arrays.asList(
        "AC Sleeper (2+1)", "Non-AC Seater (2+2)", "Volvo Multi-Axle AC",
        "Scania AC Semi-Sleeper", "Electric AC"
    );

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedBuses();
    }

    /**
     * Upsert admin user — always ensures the fixed admin exists
     * with the correct credentials even if DB is wiped and re-seeded.
     */
    private void seedAdminUser() {
        Optional<User> existing = userRepository.findByEmail(adminEmail);

        if (existing.isPresent()) {
            User admin = existing.get();
            admin.setRoles(new HashSet<>(Arrays.asList("ROLE_USER", "ROLE_ADMIN")));
            userRepository.save(admin);
            System.out.println("✅ DataSeeder: Admin account already exists — roles verified.");
        } else {
            User admin = new User();
            admin.setFullname(adminFullname);
            admin.setEmail(adminEmail);
            admin.setPhoneNumber(adminPhone);
            admin.setPassword(passwordEncoder.encode(adminPasswordRaw));
            admin.setRoles(new HashSet<>(Arrays.asList("ROLE_USER", "ROLE_ADMIN")));
            admin.setEnabled(true);
            userRepository.save(admin);

            System.out.println("✅ DataSeeder: Admin account created successfully.");
            System.out.println("======================================================");
            System.out.println("  ADMIN LOGIN CREDENTIALS");
            System.out.println("  Email    : " + adminEmail);
            System.out.println("  Phone    : " + adminPhone);
            System.out.println("======================================================");
        }
    }

    private void seedBuses() {
        busRepository.deleteAll();
        System.out.println("🧹 DataSeeder: Cleared old, expired buses.");
        System.out.println("🚀 DataSeeder: Generating comprehensive bus network...");

        List<Bus> buses = new ArrayList<>();
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(30);

        for (LocalDate date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
            for (String from : HUBS) {
                for (String to : HUBS) {
                    if (!from.equals(to)) {
                        buses.addAll(generateDailyBuses(date, from, to, 3));
                    }
                }
                for (String to : DESTINATIONS) {
                    buses.addAll(generateDailyBuses(date, from, to, 1));
                    buses.addAll(generateDailyBuses(date, to, from, 1));
                }
            }
            if (buses.size() > 1000) {
                busRepository.saveAll(buses);
                buses.clear();
            }
        }
        if (!buses.isEmpty()) busRepository.saveAll(buses);
        System.out.println("✅ DataSeeder: COMPLETE! Database populated with fresh schedules.");
    }

    private List<Bus> generateDailyBuses(LocalDate date, String from, String to, int count) {
        List<Bus> routeBuses = new ArrayList<>();
        ThreadLocalRandom random = ThreadLocalRandom.current();

        for (int i = 0; i < count; i++) {
            int hour;
            if (i == 0) hour = 6 + random.nextInt(4);
            else if (i == 1) hour = 19 + random.nextInt(4);
            else hour = 12 + random.nextInt(6);

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
            bus.setBusNumber("KA-" + (10 + random.nextInt(89)) + "-"
                    + (char) ('A' + random.nextInt(26))
                    + (char) ('A' + random.nextInt(26))
                    + "-" + (1000 + random.nextInt(8999)));
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
