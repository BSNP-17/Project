import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check for User Data on Load
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("userData");
        const token = localStorage.getItem("token");
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // 2. Login Function (Saves to Storage)
  const login = (userData, token) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // 3. Logout Function (Clears Storage)
  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return { user, loading, login, logout };
};

export default useAuth;