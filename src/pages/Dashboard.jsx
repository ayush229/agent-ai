import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { getAuthHeader } from "../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [newUrls, setNewUrls] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
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
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
    setLoading(false);
  };

  const handleEdit = (agent) => {
    setSelectedAgent(agent);
    setNewUrls(agent.urls.join(","));
    setOpenDialog(true);
  };

  const handleDelete = async (agentId) => {
    try {
      await axios.delete(
        `https://web-scraper-api-production-fbd4.up.railway.app/agents/${agentId}`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      fetchAgents();
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  const handleUpdateAgent = async () => {
    try {
      const response = await axios.put(
        `https://web-scraper-api-production-fbd4.up.railway.app/agents/${selectedAgent.agent_id}`,
        {
          url: newUrls,
        },
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      setOpenDialog(false);
      fetchAgents();
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Agent Dashboard
      </Typography>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create")}
        >
          Create New Agent
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {agents.map((agent) => (
            <Grid item xs={12} sm={6} md={4} key={agent.agent_id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">{agent.agent_name}</Typography>
                <List>
                  {agent.urls.map((url, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={url} />
                    </ListItem>
                  ))}
                </List>
                <Box display="flex" justifyContent="space-between">
                  <IconButton onClick={() => handleEdit(agent)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(agent.agent_id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Agent Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Agent URLs</DialogTitle>
        <DialogContent>
          <TextField
            label="URLs"
            fullWidth
            value={newUrls}
            onChange={(e) => setNewUrls(e.target.value)}
            helperText="Comma-separated URLs"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateAgent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;
