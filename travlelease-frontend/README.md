# 🚌 TravelEase

TravelEase is a full-stack bus booking web application built with **React (Material UI)** on the frontend and **Spring Boot + MongoDB** on the backend. It’s designed as an academic + professional benchmark project, modeled after industry leaders like RedBus, but with creative polish and QA rigor.

---

## ✨ Features

### 🔐 Authentication
- JWT-based login & signup
- Protected routes with role-based access (user/admin)
- Personalized navbar greetings via decoded JWT

### 🎟️ Booking Flow
- Search buses by route, operator, departure time
- Rich autocomplete with:
  - Dynamic backend suggestions
  - Metadata (operator, departure, fare)
  - Icons 🚌 ⏰ 💰
  - Highlighted matches
  - Keyboard navigation (arrow keys + Enter)
  - Loading spinner + “No results found” fallback
  - Recent searches history (localStorage)
  - Clear history button

### 🎨 UI/UX Polish
- Animated ticket confirmation (tear-off effect, QR code)
- Boarding countdown widget
- Gate animation
- PDF download + WhatsApp/Email share
- Consistent design system with Material UI theme

### 🛠️ Backend
- RESTful APIs with Spring Boot
- MongoDB for scalable data storage
- Error handling & validation
- Admin dashboard for managing buses, routes, and bookings

### 🧪 QA & Testing
- Excel-style test case tracking
- Professional QA documentation
- Integration tests for backend endpoints
- ErrorBoundary for runtime crash handling

### 📊 Monitoring
- **Sentry integration** for error logging
- User context attached to error reports
- Custom tags (page, role, severity) for filtering
- Performance monitoring with BrowserTracing

---

## 🚀 Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React, Material UI, Axios |
| Backend      | Spring Boot, MongoDB |
| Auth         | JWT, Protected Routes |
| QA/Testing   | Postman, Thunder Client, Excel-style test cases |
| Monitoring   | Sentry (errors + performance) |

---

## 📂 Project Structure
