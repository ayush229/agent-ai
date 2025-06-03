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
  Snackbar, // Import Snackbar for copy confirmation
  Alert, // Import Alert for Snackbar content
} from "@mui/material";
import { Delete, Edit, ContentCopy as ContentCopyIcon } from "@mui/icons-material"; // Import ContentCopy icon
import { getAuthHeader } from "../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard'; // Import CopyToClipboard

const DashboardPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [newUrls, setNewUrls] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      // Ensure your backend's /agents endpoint returns agent objects with an 'agent_id' property
      const response = await axios.get(
        "https://web-scraper-api-production-ec96.up.railway.app/agents",
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      // Assuming response.data.agents contains objects with agent_id, agent_name, urls
      setAgents(response.data.agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      // Optionally show an error message to the user
    }
    setLoading(false);
  };

  const handleEdit = (agent) => {
    // Ensure agent object includes 'urls' as an array and 'agent_id' for dialog logic
    setSelectedAgent(agent);
    // Assuming agent.urls is an array for joining
    setNewUrls(Array.isArray(agent.urls) ? agent.urls.join(",") : "");
    setOpenDialog(true);
  };

  const handleDelete = async (agentIdToDelete) => { // Renamed parameter for clarity
    // Confirmation dialog before deleting is recommended
    if (window.confirm("Are you sure you want to delete this agent?")) {
        try {
          // Assuming your backend delete endpoint uses the agent_id as the identifier
          await axios.delete(
            `https://web-scraper-api-production-ec96.up.railway.app/agents/${agentIdToDelete}`, // Use the agentId (unique code) for DELETE request
            {
              headers: {
                Authorization: getAuthHeader(),
              },
            }
          );
          fetchAgents(); // Refresh the list after deletion
          // Optionally show a success message
        } catch (error) {
          console.error("Error deleting agent:", error);
          // Optionally show an error message to the user
        }
    }
  };


  const handleUpdateAgent = async () => {
    if (!selectedAgent) return; // Should not happen if dialog is open correctly

    try {
      // Assuming your backend update endpoint uses the agent_id and expects urls string
      const response = await axios.put(
        `https://web-scraper-api-production-ec96.up.railway.app/agents/${selectedAgent.agent_id}`, // <--- Use selectedAgent.agent_id for PUT request
        {
          url: newUrls, // Backend expects urls string (comma-separated)
        },
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      setOpenDialog(false);
      fetchAgents(); // Refresh the list after update
      // Optionally show a success message
    } catch (error) {
      console.error("Error updating agent:", error);
      // Optionally show an error message to the user
    }
  };

  const handleCopySuccess = () => {
    setSnackbarMessage("Unique code copied to clipboard!");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Agent Dashboard
      </Typography>

      {/* Conditionally render the Create New Agent button */}
      {agents.length === 0 && !loading && ( // <-- Only show if no agents AND not loading
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
        <Grid container spacing={3}> {/* Increased spacing */}
          {agents.map((agent) => (
            // Ensure your backend returns agent objects with a 'agent_id' property and it's used as the key
            <Grid item xs={12} sm={6} md={4} key={agent.agent_id}> {/* Use agent.agent_id as key */}
              <Paper elevation={3} sx={{ p: 3 }}> {/* Increased padding */}
                <Typography variant="h6" gutterBottom>{agent.agent_name}</Typography> {/* Added bottom margin */}

                {/* Display Unique Code with Copy Button */}
                <Box display="flex" alignItems="center" mb={2}> {/* Added bottom margin */}
                    <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
                        Code:
                    </Typography>
                    {/* Display the agent_id */}
                    <Typography variant="body2" sx={{ flexGrow: 1, overflowWrap: 'break-word' }}>
                         {agent.agent_id}
                    </Typography>
                    {/* Copy the agent_id to clipboard */}
                    <CopyToClipboard text={agent.agent_id} onCopy={handleCopySuccess}>
                        <IconButton size="small" aria-label="copy unique code">
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </CopyToClipboard>
                </Box>


                <Typography variant="subtitle2" gutterBottom>URLs:</Typography> {/* Label for URLs */}
                <List dense={true}> {/* Make list dense */}
                  {/* Ensure agent.urls is an array */}
                  {Array.isArray(agent.urls) && agent.urls.map((url, index) => (
                    <ListItem key={index} disableGutters={true} sx={{ py: 0 }}> {/* Remove padding */}
                      <ListItemText primary={url} primaryTypographyProps={{ variant: 'body2', overflowWrap: 'break-word' }} /> {/* Make text smaller and wrap */}
                    </ListItem>
                  ))}
                </List>

                <Box display="flex" justifyContent="flex-end" mt={2}> {/* Align buttons to the right, add top margin */}
                  {/* Pass the whole agent object to handleEdit to populate dialog */}
                  <IconButton onClick={() => handleEdit(agent)} aria-label="edit agent">
                    <Edit />
                  </IconButton>
                  {/* Pass the agent_id for deletion */}
                  <IconButton onClick={() => handleDelete(agent.agent_id)} aria-label="delete agent"> {/* Use agent.agent_id for delete */}
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Agent Dialog */}
      {/* Only render dialog if an agent is selected to prevent errors */}
      {selectedAgent && (
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            {/* Use optional chaining (?) in case selectedAgent is null briefly */}
            <DialogTitle>Edit Agent URLs: {selectedAgent?.agent_name}</DialogTitle>
            <DialogContent>
              <TextField
                label="URLs"
                fullWidth
                value={newUrls}
                onChange={(e) => setNewUrls(e.target.value)}
                helperText="Comma-separated URLs"
                margin="normal"
                multiline // Allow multiple lines
                rows={4} // Set initial number of rows
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUpdateAgent} color="primary" disabled={!selectedAgent}> {/* Disable if no agent selected */}
                Save
              </Button>
            </DialogActions>
          </Dialog>
      )}


      {/* Snackbar for Copy Confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Hide after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position at bottom center
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default DashboardPage;
