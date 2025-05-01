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
      // Ensure your backend's /agents endpoint returns the unique_code
      const response = await axios.get(
        "https://web-scraper-api-production-fbd4.up.railway.app/agents",
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      // Assuming response.data.agents contains objects with unique_code, agent_name, urls
      setAgents(response.data.agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      // Optionally show an error message to the user
    }
    setLoading(false);
  };

  const handleEdit = (agent) => {
    // Ensure agent object includes 'urls' as an array and 'unique_code' as agent_id for dialog logic
    setSelectedAgent(agent);
    // Assuming agent.urls is an array for joining
    setNewUrls(Array.isArray(agent.urls) ? agent.urls.join(",") : "");
    setOpenDialog(true);
  };

  const handleDelete = async (agentUniqueCode) => {
    // Confirmation dialog before deleting is recommended
    if (window.confirm("Are you sure you want to delete this agent?")) {
        try {
          // Assuming your backend delete endpoint uses the unique_code as the identifier
          await axios.delete(
            `https://web-scraper-api-production-fbd4.up.railway.app/agent/${agentUniqueCode}`, // <-- Use unique_code for DELETE request
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
      // Assuming your backend update endpoint uses the unique_code and expects urls string
      const response = await axios.put(
        `https://web-scraper-api-production-fbd4.up.railway.app/agent/${selectedAgent.unique_code}`, // <-- Use unique_code for PUT request
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
            // Make sure your backend returns agent objects with a 'unique_code' property
            <Grid item xs={12} sm={6} md={4} key={agent.unique_code}> {/* Use unique_code as key */}
              <Paper elevation={3} sx={{ p: 3 }}> {/* Increased padding */}
                <Typography variant="h6" gutterBottom>{agent.agent_name}</Typography> {/* Added bottom margin */}

                {/* Display Unique Code with Copy Button */}
                <Box display="flex" alignItems="center" mb={2}> {/* Added bottom margin */}
                    <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
                        Code:
                    </Typography>
                    <Typography variant="body2" sx={{ flexGrow: 1, overflowWrap: 'break-word' }}>
                         {agent.unique_code} {/* Display the unique code */}
                    </Typography>
                    <CopyToClipboard text={agent.unique_code} onCopy={handleCopySuccess}>
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
                  <IconButton onClick={() => handleEdit(agent)} aria-label="edit agent">
                    <Edit />
                  </IconButton>
                  {/* Ensure agent.unique_code is used for deletion if that's what the backend expects */}
                  <IconButton onClick={() => handleDelete(agent.unique_code)} aria-label="delete agent"> {/* Use unique_code for delete */}
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Agent Dialog */}
      {/* Ensure selectedAgent is used to pre-fill dialog and for update API call */}
      {selectedAgent && ( // Only render dialog if an agent is selected
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Edit Agent URLs: {selectedAgent?.agent_name}</DialogTitle> {/* Show agent name */}
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
