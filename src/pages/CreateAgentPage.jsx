import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { getAuthHeader } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const CreateAgentPage = () => {
  const [agentName, setAgentName] = useState("");
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateAgent = async () => {
    if (!agentName || !urls) {
      setError("Both agent name and URLs are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://web-scrap-scrapy-production.up.railway.app/scrape_and_store",
        {
          agent_name: agentName,
          url: urls,
        },
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      setLoading(false);
      navigate("/dashboard"); // Redirect to dashboard on success
    } catch (err) {
      setLoading(false);
      setError("Error creating agent. Please try again.");
      console.error("Error creating agent:", err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create New Agent
      </Typography>
      <Box mb={2}>
        <TextField
          label="Agent Name"
          fullWidth
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="URLs (comma separated)"
          fullWidth
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          margin="normal"
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateAgent}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Agent"}
        </Button>
      </Box>
    </Container>
  );
};

export default CreateAgentPage;
