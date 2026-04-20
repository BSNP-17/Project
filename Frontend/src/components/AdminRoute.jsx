import { Navigate } from "react-router-dom";

/**
 * AdminRoute - Protects routes that require ADMIN role.
 * Checks for JWT token AND admin role in localStorage.
 * If not admin, redirects to /home.
 */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);
    const roles = user?.roles || [];
    const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("admin");

    if (!isAdmin) {
      return <Navigate to="/home" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
