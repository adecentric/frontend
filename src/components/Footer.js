// frontend/src/components/Footer.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: 1.5,
        textAlign: 'center',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.2)',
        zIndex: 1300, // above other content
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()}{' '}
        <Link href="/" color="inherit" underline="hover">
          Movie App
        </Link>
        . All rights reserved.
      </Typography>

    </Box>
  );
}
