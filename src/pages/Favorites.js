// frontend/src/pages/Favorites.js
import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Favorites = () => {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Load from localStorage immediately on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/favorites`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('🎉 Raw favorites response:', res.data);
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.favorites)
            ? res.data.favorites
            : [];
        setFavorites(data);
      } catch (err) {
        console.error('❌ Failed to fetch favorites:', err);
        setSnackbar({ open: true, message: 'Failed to load favorites', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleRemove = async (movieId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/user/favorites/${movieId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites((prev) => prev.filter((fav) => fav.movieId !== movieId));
      setSnackbar({ open: true, message: 'Removed from favorites', severity: 'success' });
    } catch (err) {
      console.error('❌ Failed to remove favorite:', err);
      setSnackbar({ open: true, message: 'Failed to remove favorite', severity: 'error' });
    }
  };

  if (!token) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6">Please log in to view your favorites.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Badge badgeContent={favorites.length} color="primary">
          <Typography variant="h4" fontWeight={600}>
            My Favorites
          </Typography>
        </Badge>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : favorites.length === 0 ? (
        <Typography>No favorites yet. Browse and add your first one!</Typography>
      ) : (
        <Grid container spacing={2}>
          {favorites.map((fav) => (
            <Grid item xs={6} sm={4} md={3} key={fav.movieId}>
              <Card
                component={Link}
                to={`/movie/${fav.movieId}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    fav.posterPath
                      ? `https://image.tmdb.org/t/p/w500${fav.posterPath}`
                      : '/placeholder.png'
                  }
                  alt={fav.title || 'No title'}
                  sx={{ height: 300 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" noWrap>
                    {fav.title || 'Untitled'}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    fullWidth
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(fav.movieId);
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Card>
              <p>
                <p>
                  <br></br>
                </p>
              </p>
              <p>
                <p>
                  <br></br>
                </p>
              </p>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Favorites;
