import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAvatarMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleAvatarMenuClose = () => setAnchorEl(null);

  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Discover', to: '/discover' },
    { label: 'Recommendations', to: '/recommendations' },
    { label: 'Top Rated', to: '/top-rated' },
    { label: 'Favorites', to: '/favorites' },
    { label: 'Upcoming', to: '/upcoming' },
    { label: 'Watchlists', to: '/watchlists' },
  ];

  return (
    <>
      {/* ✅ Make AppBar sticky */}
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            🎬 Recommended Movie App
          </Typography>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map(link => (
              <Button key={link.to} color="inherit" component={Link} to={link.to}>
                {link.label}
              </Button>
            ))}
            {token ? (
              <>
                <IconButton onClick={handleAvatarMenuOpen} sx={{ p: 0 }}>
                  <Avatar src={user?.avatar} alt={user?.username} sx={{ width: 32, height: 32 }} />
                </IconButton>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {user?.username}
                </Typography>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={toggleMobileDrawer}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Avatar Menu (desktop dropdown) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAvatarMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleAvatarMenuClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { logout(); handleAvatarMenuClose(); }}>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleMobileDrawer}
        sx={{ display: { md: 'none' } }}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleMobileDrawer}>
          {/* ✅ Show profile picture at top if logged in */}
          {token && (
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Avatar src={user?.avatar} alt={user?.username} sx={{ width: 40, height: 40, mr: 1 }} />
              <Typography variant="body1" noWrap>{user?.username}</Typography>
            </Box>
          )}
          <Divider />

          <List>
            {navLinks.map(link => (
              <ListItem button key={link.to} component={Link} to={link.to}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            <Divider />
            {token ? (
              <>
                <ListItem button component={Link} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={logout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} to="/register">
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
