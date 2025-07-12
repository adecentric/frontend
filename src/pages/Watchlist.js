import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Grid, Card, CardMedia, CardContent, Button, Box
} from '@mui/material';
import { Link } from 'react-router-dom';

const Watchlists = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Also save to localStorage as cache
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/watchlist');
      setWatchlist(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch watchlist:', err.message);
      // fallback to localStorage
      const stored = localStorage.getItem('watchlist');
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  // Add to watchlist and save to backend
 /* const addMovieToWatchlist = async (movie) => {
    try {
      const res = await axios.post('http://localhost:5000/api/watchlist', {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path
      });
      setWatchlist(res.data || []);
    } catch (err) {
      console.error('❌ Failed to add movie:', err.message);
    }
  };*/

  // Remove from watchlist
  const removeFromWatchlist = async (movieId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/watchlist/${movieId}`);
      setWatchlist(res.data || []);
    } catch (err) {
      console.error('❌ Failed to remove movie:', err.message);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📺 Your Watchlist</Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : watchlist.length === 0 ? (
        <Typography>No movies in your watchlist yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {watchlist.map(movie => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.movieId || movie.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Link to={`/movie/${movie.movieId || movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.posterPath || movie.poster_path}`}
                    alt={movie.title}
                    sx={{ height: 300 }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" noWrap>{movie.title}</Typography>
                  </CardContent>
                </Link>
                <Box sx={{ p: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    fullWidth
                    onClick={() => removeFromWatchlist(movie.movieId || movie.id)}
                  >
                    ❌ Remove
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
    </Container>
  );
};

export default Watchlists;
