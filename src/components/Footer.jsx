import React from 'react';
import { Box, Typography } from '@mui/material'; // Using MUI components for styling

const Footer = () => {
  return (
    // Use Box to style the footer container
    <Box
      sx={{
        width: '100%',
        textAlign: 'center', // Center the text
        mt: 'auto', // Push the footer to the bottom if using flexbox layout in a parent
        py: 2, // Padding top and bottom
        // Add background color or border if desired
        // borderTop: '1px solid #ccc',
        // backgroundColor: '#f0f0f0',
      }}
    >
      <Typography variant="body2" color="textSecondary"> {/* Use body2 variant for smaller text */}
        Powered by Ayush Anand
      </Typography>
    </Box>
  );
};

export default Footer;
