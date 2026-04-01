import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // ✅ Added import
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BusResults from "./pages/BusResults";
import SeatSelection from "./pages/SeatSelection";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import CartPage from "./pages/CartPage"; // ✅ Added import

function App() {
  return (
    <CartProvider> {/* ✅ Wrap the Router in CartProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/buses" element={<BusResults />} />
          <Route path="/seat/:busId" element={<SeatSelection />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/payment" element={<Payment />} /> {/* Catch-all for cart checkout */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/cart" element={<CartPage />} /> {/* ✅ Add Cart Route */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;