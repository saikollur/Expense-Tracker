// components/ThemeProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a CustomThemeProvider");
  }
  return context;
};

export const CustomThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if there's a saved preference in localStorage
    const saved = localStorage.getItem("expenseTracker_darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default to system preference if available
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return true;
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("expenseTracker_darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      const savedPreference = localStorage.getItem("expenseTracker_darkMode");
      if (savedPreference === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#667eea",
        dark: "#5a67d8",
        light: "#7c8df0",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#764ba2",
        dark: "#6b46c1",
        light: "#8b5cf6",
        contrastText: "#ffffff",
      },
      background: {
        default: darkMode ? "#0f0f0f" : "#fafafa",
        paper: darkMode ? "#1a1a1a" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#1a202c",
        secondary: darkMode ? "#a0aec0" : "#718096",
      },
      divider: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
      error: {
        main: "#f56565",
        dark: "#e53e3e",
        light: "#feb2b2",
      },
      warning: {
        main: "#ed8936",
        dark: "#dd6b20",
        light: "#fbd38d",
      },
      info: {
        main: "#4299e1",
        dark: "#3182ce",
        light: "#90cdf4",
      },
      success: {
        main: "#48bb78",
        dark: "#38a169",
        light: "#9ae6b4",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 8,
            padding: "8px 24px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
          contained: {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
              transform: "translateY(-1px)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: darkMode
              ? "0 4px 20px rgba(0, 0, 0, 0.3)"
              : "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: darkMode ? "#667eea" : "#667eea",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#667eea",
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${
              darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
            }`,
          },
          head: {
            fontWeight: 600,
            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.02)"
              : "rgba(0, 0, 0, 0.02)",
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              boxShadow: "0 12px 35px rgba(102, 126, 234, 0.5)",
            },
          },
        },
      },
    },
    transitions: {
      easing: {
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
