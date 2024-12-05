import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./Registration.css"; // Import the CSS file

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    bio: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection and generate preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null);
    }
  };

  // Validate input fields
  const validateFields = () => {
    const newErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (formData.full_name && /[^a-zA-Z\s]/.test(formData.full_name)) {
      newErrors.full_name = "Full name can only contain letters and spaces.";
    }

    if (profilePicture && !/\.(jpg|jpeg|png)$/i.test(profilePicture.name)) {
      newErrors.profile_picture =
        "Profile picture must be a .jpg or .png file.";
    }

    if (formData.bio && formData.bio.length > 250) {
      newErrors.bio = "Bio cannot exceed 250 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setMessage("Please fix the errors in the form.");
      return;
    }

    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("full_name", formData.full_name);
    form.append("bio", formData.bio);
    if (profilePicture) form.append("profile_picture", profilePicture);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 201) {
        setMessage('Registration successful!');
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2 className="registration-form-header">Register</h2>
        <label className="registration-form-label">
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="registration-form-input"
            required
          />
          {errors.username && (
            <p className="registration-form-error">{errors.username}</p>
          )}
        </label>
        <label className="registration-form-label">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="registration-form-input"
            required
          />
          {errors.email && (
            <p className="registration-form-error">{errors.email}</p>
          )}
        </label>
        <label className="registration-form-label">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="registration-form-input"
            required
          />
          {errors.password && (
            <p className="registration-form-error">{errors.password}</p>
          )}
        </label>
        <label className="registration-form-label">
          Full Name:
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="registration-form-input"
          />
          {errors.full_name && (
            <p className="registration-form-error">{errors.full_name}</p>
          )}
        </label>
        <label className="registration-form-label">
          Profile Picture:
          <input
            type="file"
            name="profile_picture"
            onChange={handleFileChange}
            className="registration-form-input-file"
          />
          {errors.profile_picture && (
            <p className="registration-form-error">{errors.profile_picture}</p>
          )}
        </label>
        {previewUrl && (
          <div className="profile-picture-preview">
            <img src={previewUrl} alt="Profile Preview" />
          </div>
        )}
        <label className="registration-form-label">
          Bio:
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="registration-form-textarea"
          />
          {errors.bio && (
            <p className="registration-form-error">{errors.bio}</p>
          )}
        </label>
        <button type="submit" className="registration-form-button">
          Register
        </button>
        {message && <p className="registration-form-message">{message}</p>}
      </form>
    </div>
  );
};

export default Registration;
