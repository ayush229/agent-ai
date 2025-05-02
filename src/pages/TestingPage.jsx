import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { getAuthHeader } from "../utils/auth";

const TestingPage = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);

  // Fetch agents on page load
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          "https://web-scraper-api-production-fbd4.up.railway.app/agents",
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        setAgents(response.data.agents);
      } catch (err) {
        setError("Error fetching agents. Please try again.");
        console.error("Error fetching agents:", err);
      }
    };

    fetchAgents();
  }, []);

  const handleAskQuery = async () => {
    if (!selectedAgent || !userQuery) {
      setError("Please select an agent and enter a query.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://web-scraper-api-production-fbd4.up.railway.app/ask_stored",
        {
          unique_code: selectedAgent,
          user_query: userQuery,
        },
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      setLoading(false);
      setResponse(response.data.ai_response);
    } catch (err) {
      setLoading(false);
      setError("Error processing the query. Please try again.");
      console.error("Error asking query:", err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Test Agent Query
      </Typography>

      <Box mb={2}>
        <Select
          fullWidth
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>
            Select an Agent
          </MenuItem>
          {agents.map((agent) => (
            <MenuItem key={agent.agent_id} value={agent.agent_id}>
              {agent.agent_name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Your Query"
          fullWidth
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          margin="normal"
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {response && <Alert severity="info">{response}</Alert>}

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAskQuery}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Ask Query"}
        </Button>
      </Box>
    </Container>
  );
};

export default TestingPage;
