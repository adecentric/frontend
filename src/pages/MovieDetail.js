import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, Stack, Button, Skeleton
} from '@mui/material';
import {
  FacebookShareButton, TwitterShareButton, WhatsappShareButton,
  LinkedinShareButton, TelegramShareButton,
  FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, TelegramIcon
} from 'react-share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [movieRes, videosRes, recRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/search/${id}`),
          axios.get(`http://localhost:5000/api/search/${id}/videos`),
          axios.get(`http://localhost:5000/api/search/${id}/recommendations`)
        ]);

        setMovie(movieRes.data);
        setVideos(videosRes.data);
        setRecommendations(recRes.data);

        // Add to watchlist in background (non-blocking)
        axios.post('http://localhost:5000/api/watchlist/add', { movie: movieRes.data })
          .catch(err => console.warn('⚠️ Failed to add to watchlist:', err.message));
      } catch (err) {
        console.error('❌ Failed to load movie data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
    // TODO: connect to backend favorites API
  };

  const shareUrl = `${window.location.origin}/movie/${id}`;
  const shareTitle = movie ? `Check out "${movie.title}"` : 'Check this movie!';

  if (loading || !movie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="100%" height={80} />
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ my: 2 }} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mt: 4 }} />
        <Grid container spacing={2}>
          {[...Array(4)].map((_, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Skeleton variant="rectangular" width="100%" height={250} />
              <Skeleton variant="text" width="80%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>{movie.title}</Typography>
      <Typography variant="body1" paragraph>{movie.overview}</Typography>

      {/* Trailer */}
      {videos.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <iframe
            width="100%" height="400"
            src={`https://www.youtube.com/embed/${videos[0].key}`}
            frameBorder="0" allowFullScreen
            title="Trailer"
          ></iframe>

          {/* Share + Favorite */}
          <Stack direction="row" spacing={1} mt={2} alignItems="center">
            <FacebookShareButton url={shareUrl} quote={shareTitle}>
              <FacebookIcon size={36} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={36} round />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <WhatsappIcon size={36} round />
            </WhatsappShareButton>
            <LinkedinShareButton url={shareUrl} title={shareTitle}>
              <LinkedinIcon size={36} round />
            </LinkedinShareButton>
            <TelegramShareButton url={shareUrl} title={shareTitle}>
              <TelegramIcon size={36} round />
            </TelegramShareButton>

            <Button
              variant={isFavorite ? 'contained' : 'outlined'}
              color="error"
              size="small"
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={toggleFavorite}
              sx={{ ml: 1 }}
            >
              {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
            </Button>
          </Stack>
        </Box>
      )}

      {/* Recommendations */}
      <Typography variant="h5" mt={4} mb={2}>Recommended</Typography>
      <Grid container spacing={2}>
        {recommendations.map(rec => (
          <Grid item xs={6} sm={4} md={3} key={rec.id}>
            <Card component={Link} to={`/movie/${rec.id}`} sx={{ textDecoration: 'none' }}>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w300${rec.poster_path}`} // smaller for mobile
                alt={rec.title}
                sx={{ height: 250 }}
              />
              <CardContent>
                <Typography variant="subtitle2" noWrap>{rec.title}</Typography>
              </CardContent>
            </Card>
              <grid><p>&nbsp; </p> </grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieDetail;
