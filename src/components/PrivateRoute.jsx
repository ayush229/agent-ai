import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./NavBar"; // Import the NavBar component

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If authenticated, render the NavBar followed by the protected page content
  return token ? (
    <> {/* Use a React Fragment to return multiple elements */}
      <NavBar /> {/* This will show the navigation bar */}
      {children} {/* This will render the actual protected page (Dashboard, Create, etc.) */}
    </>
  ) : (
    // If not authenticated, redirect to the login page
    <Navigate to="/" />
  );
};

export default PrivateRoute;
