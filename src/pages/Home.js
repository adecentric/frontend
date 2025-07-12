// frontend/src/pages/Home.js
import React, { useEffect, useState, useContext } from 'react';
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
  TextField,
  MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const genreOptions = [
  { value: '', label: 'All Genres' },
  { value: '28', label: 'Action' },
  { value: '35', label: 'Comedy' },
  { value: '18', label: 'Drama' },
  { value: '27', label: 'Horror' },
  { value: '10749', label: 'Romance' },
];

const ratingOptions = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: `${i}+`,
}));

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'popularity.desc', label: 'Popularity ↓' },
  { value: 'popularity.asc', label: 'Popularity ↑' },
  { value: 'release_date.desc', label: 'Date ↓' },
  { value: 'release_date.asc', label: 'Date ↑' },
];

export default function Home() {
  const { token } = useContext(AuthContext);

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('');

  // load first page on mount
  useEffect(() => {
    resetAndFetch();
    // eslint-disable-next-line
  }, []);

  // fetch (or append) results
  const fetchMovies = async ({ append = false, pageToLoad = 1 } = {}) => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/search/filter`;
      let params = {
        title,
        genre,
        yearFrom,
        yearTo,
        minRating,
        sortBy,
        page: pageToLoad,
      };

      // if no filters, hit the popular endpoint
      if (!title && !genre && !yearFrom && !yearTo && !minRating && !sortBy) {
        url = `${process.env.REACT_APP_API_URL}/api/search/popular`;
        params = { page: pageToLoad };
      }

      const { data } = await axios.get(url, { params });
      // TMDB returns { results, total_pages }
      const results = data.results ?? data;
      const totalPages = data.total_pages ?? (results.length ? pageToLoad : 0);

      setMovies(prev => (append ? [...prev, ...results] : results));
      setPage(pageToLoad);
      setHasMore(pageToLoad < totalPages);
    } catch (err) {
      console.error('❌ Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  // reset list and fetch page 1
  const resetAndFetch = () => {
    setMovies([]);
    setHasMore(true);
    fetchMovies({ append: false, pageToLoad: 1 });
  };

  const handleSearch = () => {
    resetAndFetch();
  };

  const loadMore = () => {
    if (!hasMore) return;
    fetchMovies({ append: true, pageToLoad: page + 1 });
  };

  const handleAddFavorite = async movie => {
    if (!token) return alert('Please log in to add favorites');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/favorites`,
        {
          movieId: movie.id.toString(),
          title: movie.title,
          posterPath: movie.poster_path,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Added to favorites!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add to favorites.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎬 Browse & Filter
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center',
        }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          size="small"
        />
        <TextField
          select
          label="Genre"
          value={genre}
          onChange={e => setGenre(e.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {genreOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Year From"
          type="number"
          value={yearFrom}
          onChange={e => setYearFrom(e.target.value)}
          size="small"
          sx={{ width: 100 }}
        />
        <TextField
          label="Year To"
          type="number"
          value={yearTo}
          onChange={e => setYearTo(e.target.value)}
          size="small"
          sx={{ width: 100 }}
        />
        <TextField
          select
          label="Min Rating"
          value={minRating}
          onChange={e => setMinRating(e.target.value)}
          size="small"
          sx={{ minWidth: 100 }}
        >
          {ratingOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          {sortOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {movies.length === 0 && loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {movies.map(movie => (
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
                      <Typography variant="caption" color="text.secondary">
                        {movie.release_date?.slice(0, 4)} · ⭐{' '}
                        {movie.vote_average.toFixed(1)}
                      </Typography>
                    </CardContent>
                  </Link>
                  <Box sx={{ p: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => handleAddFavorite(movie)}
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

          {/* Load More */}
          {hasMore && (
            <Box textAlign="center" my={4}>
              <Button
                variant="contained"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'Loading…' : 'Load More'}
              </Button>
              
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
