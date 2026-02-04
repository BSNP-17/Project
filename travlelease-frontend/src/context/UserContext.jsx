import React, { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // decoded JWT payload (e.g., { name, email, role })
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}