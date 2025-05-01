import React from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";

const APIsPage = () => {
  const curlCommands = [
    {
      title: "Scrape and Store Agent",
      url: "/scrape_and_store",
      command: `curl -X POST \\
  https://web-scraper-api-production-fbd4.up.railway.app/scrape_and_store \\
  -u ayush1:blackbox098 \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "agent_name": "ExampleAgent"
  }'`,
    },
    {
      title: "Ask Stored Agent",
      url: "/ask_stored",
      command: `curl -X POST \\
  https://web-scraper-api-production-fbd4.up.railway.app/ask_stored \\
  -u ayush1:blackbox098 \\
  -H "Content-Type: application/json" \\
  -d '{
    "unique_code": "AGENT123",
    "user_query": "What is this website about?"
  }'`,
    },
    {
      title: "Get All Agents",
      url: "/agents",
      command: `curl -X GET \\
  -u ayush1:blackbox098 \\
  https://web-scraper-api-production-fbd4.up.railway.app/agents`,
    },
    {
      title: "Update Agent",
      url: "/agents/<unique_code>",
      command: `curl -X PUT \\
  https://web-scraper-api-production-fbd4.up.railway.app/agents/AGENT123 \\
  -u ayush1:blackbox098 \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.org,https://httpbin.org/base64/SFRUUEJJTiBpcyBhd2Vzb21l"
  }'`,
    },
    {
      title: "Delete Agent",
      url: "/agents/<unique_code>",
      command: `curl -X DELETE \\
  -u ayush1:blackbox098 \\
  https://web-scraper-api-production-fbd4.up.railway.app/agents/AGENT123`,
    },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        API Documentation
      </Typography>

      <Box mb={2}>
        <Typography variant="h6">
          Use the following cURL commands to interact with the API:
        </Typography>
      </Box>

      {curlCommands.map((api, index) => (
        <Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">{api.title}</Typography>
          <TextField
            fullWidth
            multiline
            value={api.command}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            sx={{ marginBottom: 2 }}
          />
          <CopyToClipboard text={api.command}>
            <Button variant="contained" color="primary">
              Copy Command
            </Button>
          </CopyToClipboard>
        </Paper>
      ))}

      <Alert severity="info">
        You can use these commands with your preferred terminal or cURL client.
      </Alert>
    </Container>
  );
};

export default APIsPage;
