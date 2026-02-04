import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "../axiosConfig";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar({ token, setToken }) {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TravelEase
        </Typography>
        {token ? (
          <Box>
            {user && (
              <Typography variant="body1" sx={{ mr: 2 }}>
                Welcome, {user.name || user.email}
              </Typography>
            )}
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/tours">
              Tours
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}