// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CustomThemeProvider, useThemeMode } from "./components/ThemeProvider";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Main App Content Component
function AppContent() {
  const { darkMode, toggleDarkMode } = useThemeMode();

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={
            <Signup darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/login"
          element={
            <Login darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/"
          element={
            <Login darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
      </Routes>
    </Router>
  );
}

// Root App Component
function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
