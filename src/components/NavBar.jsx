import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation to highlight active link
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'; // Using MUI components for a simple bar

const NavBar = () => {
  const location = useLocation(); // Get current location to style active link

  // Helper function to check if a link is active
  const isActive = (pathname) => {
    return location.pathname === pathname;
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}> {/* AppBar for a simple navigation bar */}
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Agent Dashboard
        </Typography>
        <Box>
          {/* Use Button with component={Link} for navigation */}
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
          {/* You might want to add a Logout button here */}
          {/*
          <Button color="inherit" onClick={() => {
              // Implement logout logic here (e.g., clear localStorage, navigate to login)
              localStorage.removeItem('token'); // Example logout
              window.location.href = '/'; // Simple redirect after logout
          }}>
            Logout
          </Button>
          */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
