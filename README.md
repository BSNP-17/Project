# TravelEase 🚌

A full-stack bus ticket booking web application built as a diploma project.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Spring Boot (Java) + Maven |
| Database | MongoDB |
| Auth | JWT (JSON Web Token) |

## Project Structure

```
Project/
├── Frontend/          # React + Vite frontend
├── travelease-backend/ # Spring Boot backend
└── Documentation/     # Project documentation
```

## Features

- User Registration & Login (JWT Authentication)
- Bus Search by source, destination & date
- Seat Selection with real-time availability
- Cart system for booking multiple buses
- Payment & Booking Confirmation
- My Bookings history
- User Profile management
- Admin panel for managing buses

## Getting Started

### Prerequisites

- Node.js >= 18
- Java 17+
- Maven
- MongoDB (running locally or MongoDB Atlas)

---

### Run the Backend

```bash
cd travelease-backend
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`

Make sure your `application.properties` has the correct MongoDB URI:
```
spring.data.mongodb.uri=mongodb://localhost:27017/travelease
```

---

### Run the Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get JWT token | No |
| GET | `/api/buses/search` | Search buses | Yes |
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings/my-bookings` | Get user bookings | Yes |
| POST | `/api/bookings/cart-checkout` | Cart checkout | Yes |
| PUT | `/api/bookings/{id}/confirm` | Confirm payment | Yes |
| DELETE | `/api/bookings/{id}/cancel` | Cancel booking | Yes |

## Frontend Pages

| Route | Page | Protected |
|---|---|---|
| `/login` | Login | No |
| `/register` | Register | No |
| `/home` | Home / Bus Search | ✅ Yes |
| `/buses` | Bus Results | ✅ Yes |
| `/seat/:busId` | Seat Selection | ✅ Yes |
| `/payment/:bookingId` | Payment | ✅ Yes |
| `/cart` | Cart | ✅ Yes |
| `/booking-success/:id` | Booking Success | ✅ Yes |
| `/my-bookings` | My Bookings | ✅ Yes |
| `/profile` | Profile | ✅ Yes |

## Developer

**B S Niranjan Patgar**  
Diploma in Engineering  
GitHub: [BSNP-17](https://github.com/BSNP-17)
