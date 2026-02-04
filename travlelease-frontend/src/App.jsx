import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import TravelEaseTheme from "./theme/TravelEaseTheme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import * as Sentry from "@sentry/react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // Example: decode JWT or fetch user profile
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
        const userContext = {
          id: payload.userId,
          email: payload.email,
          username: payload.username,
        };
        setUser(userContext);

        // Attach to Sentry
        Sentry.setUser(userContext);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    } else {
      Sentry.setUser(null); // clear context if logged out
    }
  }, [token]);

  return (
    <ThemeProvider theme={TravelEaseTheme}>
      <ErrorBoundary>
        <div className="app">
          <Navbar token={token} setToken={setToken} />
          <AppRoutes token={token} setToken={setToken} />
          <Footer />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;