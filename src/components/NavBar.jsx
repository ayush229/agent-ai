import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'; // Using MUI components for a simple bar
import { logout } from '../utils/auth'; // Import the logout utility function

const NavBar = () => {
  const location = useLocation(); // Get current location to style active link
  const navigate = useNavigate(); // Get navigate function

  // Helper function to check if a link is active
  const isActive = (pathname) => {
    return location.pathname === pathname;
  };

  const handleLogout = () => {
    logout(); // Call the logout utility to remove the token
    navigate('/'); // Redirect to the login page (root path)
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}> {/* AppBar for a simple navigation bar */}
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Agent Dashboard
        </Typography>
        <Box>
          {/* Navigation Links */}
          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            sx={{ mr: 2, textDecoration: isActive('/dashboard') ? 'underline' : 'none' }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/create"
            sx={{ mr: 2, textDecoration: isActive('/create') ? 'underline' : 'none' }}
          >
            Create Agent
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/test"
            sx={{ mr: 2, textDecoration: isActive('/test') ? 'underline' : 'none' }}
          >
            Test Agent
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/api"
            sx={{ mr: 2, textDecoration: isActive('/api') ? 'underline' : 'none' }}
          >
            APIs
          </Button>

          {/* Logout Button */}
          <Button color="inherit" onClick={handleLogout}> {/* Use handleLogout function */}
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
