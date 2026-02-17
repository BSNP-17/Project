import { createContext, useState, useContext, useEffect } from "react";

// Create the Context
const BookingContext = createContext();

// Create the Provider Component
export const BookingProvider = ({ children }) => {
  // Try to load saved booking from localStorage (so data isn't lost on refresh)
  const [bookingData, setBookingData] = useState(() => {
    const savedData = localStorage.getItem("currentBooking");
    return savedData ? JSON.parse(savedData) : {
      busId: null,
      busDetails: null, // { name, type, departureTime }
      selectedSeats: [],
      totalAmount: 0,
      from: "",
      to: "",
      date: ""
    };
  });

  // Save to localStorage whenever bookingData changes
  useEffect(() => {
    localStorage.setItem("currentBooking", JSON.stringify(bookingData));
  }, [bookingData]);

  // Function to update specific fields
  const updateBooking = (newData) => {
    setBookingData((prev) => ({
      ...prev,
      ...newData
    }));
  };

  // Function to clear data after successful payment
  const resetBooking = () => {
    localStorage.removeItem("currentBooking");
    setBookingData({
      busId: null,
      busDetails: null,
      selectedSeats: [],
      totalAmount: 0,
      from: "",
      to: "",
      date: ""
    });
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom Hook to use the context easily
export const useBooking = () => {
  return useContext(BookingContext);
};