// frontend/src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Link, Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Footer() {
  const [visible, setVisible] = useState(false);

  // Show button only after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Footer */}
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
          zIndex: 1300,
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

      {/* Scroll to top button */}
      <Zoom in={visible}>
        <Fab
          color="secondary"
          size="small"
          onClick={scrollToTop}
          aria-label="scroll back to top"
          sx={{
            position: 'fixed',
            bottom: 70, // above footer
            right: 16,
            zIndex: 1500,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </>
  );
}
