import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BusResults from "./pages/BusResults";
import SeatSelection from "./pages/SeatSelection";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings"; // ✅ Fixed: Import plural file
import BookingSuccess from "./pages/BookingSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/buses" element={<BusResults />} />
        <Route path="/seat/:busId" element={<SeatSelection />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/booking-success/:bookingId" element={<BookingSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} /> {/* ✅ Add Route */}
      </Routes>
    </Router>
  );
}

export default App;