// TravelEaseTheme.js
import { createTheme } from "@mui/material/styles";

const TravelEaseTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Bus journey blue
    },
    secondary: {
      main: "#4caf50", // Success green
    },
    error: {
      main: "#e91e63", // Accent pink (female passenger)
    },
    warning: {
      main: "#ff9800", // Accent orange (child passenger)
    },
    background: {
      default: "#fafafa", // Neutral background
      paper: "#fff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 700,
      color: "#1976d2",
    },
    h6: {
      fontWeight: 600,
      color: "#0d47a1",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.8rem",
      color: "#757575",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        containedSecondary: {
          backgroundColor: "#4caf50",
          "&:hover": {
            backgroundColor: "#388e3c",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepIcon-root.Mui-active": {
            color: "#1976d2",
            filter: "drop-shadow(0 0 6px #1976d2)",
            transform: "scale(1.2)",
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "#4caf50",
            filter: "drop-shadow(0 0 6px #4caf50)",
          },
        },
      },
    },
  },
});

export default TravelEaseTheme;