import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import CreateAgentPage from "./pages/CreateAgentPage";
import TestAgentPage from "./pages/TestingPage";
import APIPage from "./pages/APIsPage";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer"; // Import the Footer component
import { Box } from "@mui/material"; // Import Box for layout

const App = () => {
  return (
    <Router>
      {/* Use a flex column layout to push the footer to the bottom */}
      {/* minHeight: '100vh' ensures the container takes at least the full viewport height */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

          {/* Box with flexGrow: 1 makes the content area grow to fill available space */}
          {/* This pushes the footer down */}
          <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                {/* Protected Routes wrapped by PrivateRoute */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <PrivateRoute>
                      <CreateAgentPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/test"
                  element={
                    <PrivateRoute>
                      <TestAgentPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/api"
                  element={
                    <PrivateRoute>
                      <APIPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
          </Box>

          {/* The Footer component is placed outside the Routes, so it appears on all pages */}
          {/* It will be pushed to the bottom by the flexGrow: 1 on the content Box */}
          <Footer />

      </div>
    </Router>
  );
};

export default App;
