import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Newsfeed from "./components/Newsfeed";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import Art from "./pages/Art";
import Travel from "./pages/Travel";
import OutDoorAdventure from "./pages/OutDoorAdventure";
import Sports from "./pages/Sports";
import Food from "./pages/Food";
import Technology from "./pages/Technology";
import Music from "./pages/Music";
import FriendSuggestions from "./components/FriendSuggestions";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Newsfeed /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/newsfeed"
          element={isAuthenticated ? <Newsfeed /> : <Navigate to="/login" />}
        />
        <Route
          path="/friends"
          element={isAuthenticated ? <FriendSuggestions /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated ? <Notifications /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/interest/art"
          element={isAuthenticated ? <Art /> : <Navigate to="/login" />}
        />
        <Route
          path="/interest/travel"
          element={isAuthenticated ? <Travel /> : <Navigate to="/login" />}
        />
        <Route
          path="/interest/outdoorAdventure"
          element={
            isAuthenticated ? <OutDoorAdventure /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/interest/sports"
          element={isAuthenticated ? <Sports /> : <Navigate to="/login" />}
        />
        <Route
          path="/interest/food"
          element={isAuthenticated ? <Food /> : <Navigate to="/login" />}
        />
        <Route
          path="/interest/technology"
          element={isAuthenticated ? <Technology /> : <Navigate to="/login" />}
        />
        <Route
          path="/interest/music"
          element={isAuthenticated ? <Music /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
