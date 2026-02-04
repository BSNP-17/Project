import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes({ token, setToken }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route
        path="/booking/:busId"
        element={
          <ProtectedRoute token={token}>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute token={token}>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirmation"
        element={
          <ProtectedRoute token={token}>
            <Confirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute token={token}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />
    </Routes>
  );
}

export default AppRoutes;