import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import BusResults from "./pages/BusResults.jsx";
import SeatSelection from "./pages/SeatSelection.jsx";
import Profile from "./pages/Profile.jsx";
import Payment from "./pages/Payment.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import CartPage from "./pages/CartPage.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes - accessible without login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - require JWT token */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/buses" element={<PrivateRoute><BusResults /></PrivateRoute>} />
          <Route path="/seat/:busId" element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
          <Route path="/payment/:bookingId" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/booking-success/:id" element={<PrivateRoute><BookingSuccess /></PrivateRoute>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
