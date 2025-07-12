// src/components/MovieCard.js
import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card onClick={handleClick} sx={{ maxWidth: 200, cursor: 'pointer', m: 1 }}>
      <CardMedia
        component="img"
        height="300"
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <CardContent>
        <Typography variant="body2" noWrap>
          {movie.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
