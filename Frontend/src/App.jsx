import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx"; // ✅ Import CartProvider
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import BusResults from "./pages/BusResults.jsx";
import SeatSelection from "./pages/SeatSelection.jsx";
import Profile from "./pages/Profile.jsx";
import Payment from "./pages/Payment.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import CartPage from "./pages/CartPage.jsx"; 
import BookingSuccess from "./pages/BookingSuccess.jsx"; // ✅ 1. ADD THIS IMPORT

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