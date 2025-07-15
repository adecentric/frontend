import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <Box
      sx={{
        height: { xs: '60vh', md: '80vh' },
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), 
          url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1350&q=80') center/cover no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#fff',
        px: 2,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
        Discover Your Next Favorite Movie
      </Typography>
      <Typography variant="h6" sx={{ mb: 4, maxWidth: 600 }}>
        Browse trending titles, add to your watchlist, and share with friends. Enjoy personalized recommendations just for you.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/search"
          sx={{ fontWeight: 'bold' }}
        >
          🔍 Start Exploring
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          component={Link}
          to="/watchlist"
        >
          📺 View Watchlist
        </Button>
      </Stack>
    </Box>
  );
}
