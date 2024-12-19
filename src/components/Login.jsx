import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { username, password }
      );
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="form-wrapper">
          <h2 className="login-header">Login</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleLogin} className="login-form">
            <label className="login-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
            />
            <label className="login-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <p className="register-text">
            Not registered?{" "}
            <Link to="/register" className="register-link">
              Go to Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
