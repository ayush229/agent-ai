import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import CreateAgentPage from "./pages/CreateAgentPage";
import TestAgentPage from "./pages/TestingPage";
import APIPage from "./pages/APIsPage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
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
    </Router>
  );
};

export default App;
