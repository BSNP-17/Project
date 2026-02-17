import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BookingProvider } from "./context/BookingContext"; // ✅ Import Provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BookingProvider>  {/* ✅ Wrap App inside Provider */}
      <App />
    </BookingProvider>
  </React.StrictMode>
);