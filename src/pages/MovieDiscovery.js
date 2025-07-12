// frontend/src/pages/MovieDiscovery.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';

const MovieDiscovery = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/now-playing`);
        setMovies(res.data.results || res.data);
      } catch (err) {
        console.error('❌ Failed to fetch now playing movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNowPlaying();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🍿 Now Playing Movies
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

export default MovieDiscovery;
