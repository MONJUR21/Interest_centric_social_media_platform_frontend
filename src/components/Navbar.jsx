import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({isAuthenticated, handleLogout}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For dropdown toggle
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/newsfeed" className="navbar-logo">
          <img
            src="https://files.oaiusercontent.com/file-2gjmdNGeSeFywHqXqemWhf?se=2024-11-23T15%3A34%3A17Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D63969077-4498-4d3f-915a-c38d6c6b0770.webp&sig=Q5QLG3rTc5to5R03sgCEerM6/iFooezDHEv0TSVY1WA%3D"
            alt="Logo"
            className="logo"
          />
          SocialApp
        </Link>
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
            
              <li>
                <Link to="/newsfeed" className={isActive('/newsfeed') ? 'active' : ''}>
                  Newsfeed
                </Link>
              </li>
              <li>
                <Link to="/friends" className={isActive('/friends') ? 'active' : ''}>
                  User List
                </Link>
              </li>
              <li>
                <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/notifications" className={isActive('/notifications') ? 'active' : ''}>
                  Notifications
                </Link>
              </li>
              <li className="navbar-item" onClick={toggleDropdown}>
                <span className="dropdown-title">Interests</span>
                {isDropdownOpen && (
                  <ul className="dropdown-list">
                    <li>
                      <Link
                        to="/interest/sports"
                        className={isActive('/interest/sports') ? 'active' : ''}
                      >
                        Sports
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/interest/music"
                        className={isActive('/interest/music') ? 'active' : ''}
                      >
                        Music
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/interest/technology"
                        className={isActive('/interest/technology') ? 'active' : ''}
                      >
                        Technology
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/interest/food"
                        className={isActive('/interest/food') ? 'active' : ''}
                      >
                        Food
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/interest/travel"
                        className={isActive('/interest/travel') ? 'active' : ''}
                      >
                        Travel
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/interest/outdoorAdventure"
                        className={isActive('/interest/outdoorAdventure') ? 'active' : ''}
                      >
                        Outdoor Adventure
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/interest/art"
                        className={isActive('/interest/art') ? 'active' : ''}
                      >
                        Art
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" className={isActive('/') ? 'active' : ''}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
