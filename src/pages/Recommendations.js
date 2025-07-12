import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import { Link } from 'react-router-dom';
import { addFavorite } from '../services/api';

const Recommendations = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Example: get popular movies as "global recommendations"
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/popular`);
        setMovies(res.data);
      } catch (err) {
        console.error('❌ Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleAddFavorite = async (movieId) => {
    try {
      await addFavorite(movieId, token);
      alert('✅ Added to favorites!');
    } catch (err) {
      console.error('❌ Failed to add favorite:', err);
      alert('Failed to add to favorites.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🔮 Recommended Movies
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <Link
                  to={`/movie/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ height: 300 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                      {movie.title}
                    </Typography>
                  </CardContent>
                </Link>
                <Box sx={{ p: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleAddFavorite(movie.id)}
                  >
                    ❤️ Add to Favorites
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

export default Recommendations;
