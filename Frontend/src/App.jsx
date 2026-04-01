import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BusResults from "./pages/BusResults";
import SeatSelection from "./pages/SeatSelection";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import CartPage from "./pages/CartPage"; 
import BookingSuccess from "./pages/BookingSuccess"; // ✅ 1. ADD THIS IMPORT

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/buses" element={<BusResults />} />
          <Route path="/seat/:busId" element={<SeatSelection />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/payment" element={<Payment />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/cart" element={<CartPage />} /> 
          
          {/* ✅ 2. ADD THIS ROUTE */}
          <Route path="/booking-success/:id" element={<BookingSuccess />} />
          
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;