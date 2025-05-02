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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete,
  Edit,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  getAgents,
  updateAgent,
  deleteAgent,
} from "../api/Api"; // Centralized API imports

const DashboardPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [newUrls, setNewUrls] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await getAgents();
      setAgents(data.agents || []);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
    setLoading(false);
  };

  const handleEdit = (agent) => {
    setSelectedAgent(agent);
    setNewUrls(Array.isArray(agent.urls) ? agent.urls.join(",") : "");
    setOpenDialog(true);
  };

  const handleDelete = async (agentIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        await deleteAgent(agentIdToDelete);
        fetchAgents();
      } catch (error) {
        console.error("Error deleting agent:", error);
      }
    }
  };

  const handleUpdateAgent = async () => {
    if (!selectedAgent) return;

    try {
      await updateAgent(selectedAgent.agent_id, newUrls);
      setOpenDialog(false);
      fetchAgents();
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  const handleCopySuccess = () => {
    setSnackbarMessage("Unique code copied to clipboard!");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Agent Dashboard
      </Typography>

      {agents.length === 0 && !loading && (
        <Box mb={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/create")}
          >
            Create New Agent
          </Button>
        </Box>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {agents.map((agent) => (
            <Grid item xs={12} sm={6} md={4} key={agent.agent_id}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {agent.agent_name}
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
                    Code:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, overflowWrap: "break-word" }}
                  >
                    {agent.agent_id}
                  </Typography>
                  <CopyToClipboard text={agent.agent_id} onCopy={handleCopySuccess}>
                    <IconButton size="small" aria-label="copy unique code">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </CopyToClipboard>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  URLs:
                </Typography>
                <List dense>
                  {Array.isArray(agent.urls) &&
                    agent.urls.map((url, index) => (
                      <ListItem key={index} disableGutters sx={{ py: 0 }}>
                        <ListItemText
                          primary={url}
                          primaryTypographyProps={{
                            variant: "body2",
                            overflowWrap: "break-word",
                          }}
                        />
                      </ListItem>
                    ))}
                </List>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <IconButton
                    onClick={() => handleEdit(agent)}
                    aria-label="edit agent"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(agent.agent_id)}
                    aria-label="delete agent"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedAgent && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Edit Agent URLs: {selectedAgent?.agent_name}</DialogTitle>
          <DialogContent>
            <TextField
              label="URLs"
              fullWidth
              value={newUrls}
              onChange={(e) => setNewUrls(e.target.value)}
              helperText="Comma-separated URLs"
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAgent}
              color="primary"
              disabled={!selectedAgent}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardPage;
