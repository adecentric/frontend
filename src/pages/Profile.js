// frontend/src/pages/Profile.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { token, login } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: '',
    email: '',
    avatar: '',
    password: '',
    age: '',
    bio: '',
  });
  const [stats, setStats] = useState({
    favorites: 0,
    watchlists: 0,
    recommendations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch profile + stats on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const [profileRes, favRes, watchRes, recRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/user/favorites`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/user/watchlists`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/user/recommendations/count`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const p = profileRes.data;
        setForm({
          username: p.username || '',
          email: p.email || '',
          avatar: p.avatar || '',
          password: '',
          age: p.age || '',
          bio: p.bio || '',
        });
        setStats({
          favorites: favRes.data.length,
          watchlists: watchRes.data.length,
          recommendations: recRes.data.count,
        });
      } catch (e) {
        console.error(e);
        setError('Failed to load your profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/profile`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // update context so navbar etc. refresh
      login(token, res.data);
      setSuccess('✅ Profile updated successfully!');
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6">Please log in to view your profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Hello, {form.username}
          </Typography>

          {/* Dashboard */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Favorites', value: stats.favorites },
              { label: 'Watchlists', value: stats.watchlists },
              { label: 'Recommendations', value: stats.recommendations },
            ].map((card) => (
              <Grid item xs={12} sm={4} key={card.label}>
                <Card>
                  <CardHeader title={card.label} />
                  <Divider />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">{card.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          >
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Box textAlign="center" mb={3}>
              <Avatar
                src={form.avatar}
                alt={form.username}
                sx={{ width: 80, height: 80, mx: 'auto' }}
              />
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Profile Picture URL"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Age"
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="New Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </form>
            <p></p><br></br><p></p>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Profile;
