// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if your backend URL is different
});

// Auth
export const register = (data) => API.post('/user/register', data);
export const login = (data) => API.post('/user/login', data);

// TMDB / search
export const fetchPopularMovies = () => API.get('/search/popular');
export const getMovieDetail = (id) => API.get(`/search/${id}`);
export const getRecommendations = (id) => API.get(`/search/${id}/recommendations`);

// User profile
export const getProfile = (token) =>
  API.get('/user/profile', { headers: { Authorization: `Bearer ${token}` } });

// Favorites
export const addFavorite = (movieId, token) =>
  API.post('/user/favorites', { movieId }, { headers: { Authorization: `Bearer ${token}` } });
export const getFavorites = (token) =>
  API.get('/user/favorites', { headers: { Authorization: `Bearer ${token}` } });

// Watchlists
export const createWatchlist = (name, token) =>
  API.post('/user/watchlists', { name }, { headers: { Authorization: `Bearer ${token}` } });
export const addToWatchlist = (watchlistId, movieId, token) =>
  API.put('/user/watchlists', { watchlistId, movieId }, { headers: { Authorization: `Bearer ${token}` } });

export default API;
