import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import MovieDetail from './pages/MovieDetail';
import Watchlists from './pages/Watchlist';
import Profile from './pages/Profile';
import Recommendations from './pages/Recommendations';
import MovieDiscovery from './pages/MovieDiscovery';
import TopRated from './pages/TopRated'; // ✅ import TopRated
import Footer from './components/Footer';
import Upcoming from './pages/Upcoming';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watchlists" element={<Watchlists />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/discover" element={<MovieDiscovery />} />
          <Route path="/top-rated" element={<TopRated />} /> {/* ✅ new Top Rated route */}
          <Route path="/upcoming" element={<Upcoming />} />
          

        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
