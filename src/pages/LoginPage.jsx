import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic frontend check (backend also verifies)
    // In a real application, this check should happen on the backend after sending credentials securely.
    if (username === "ayush1" && password === "blackbox098") {
      // Store base64 encoded credentials as "token" for Basic Auth header
      // This key ("token") must match the key used in src/utils/auth.js
      localStorage.setItem("token", btoa(`${username}:${password}`));
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } else {
      setError("Invalid credentials"); // Show error message for invalid login
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 12, p: 4 }}>
        {/* Updated Heading Text as requested */}
        <Typography variant="h5" align="center" gutterBottom>
          AI Agent Admin Login {/* Changed the text here */}
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
