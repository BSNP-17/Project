import { Navigate } from "react-router-dom";

/**
 * PrivateRoute - Protects routes that require authentication.
 * Checks for JWT token in localStorage.
 * If token not found, redirects user to /login.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
