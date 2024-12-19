import React, { useState } from "react";
import axios from "axios";
import "./ProfileHeader.css";
const ProfileHeader = ({ userInfo, followersCount, followingCount }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [userList, setUserList] = useState([]);
  const [formData, setFormData] = useState({
    fullName: userInfo.fullName,
    bio: userInfo.bio,
    profilePicture: userInfo.profilePicture || "",
  });
  const [loading, setLoading] = useState(false);  // For loading state
  const [modalType, setModalType] = useState("");  // New state to track the type of modal

  const handleShowUsers = async (type) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const endpoint =
        type === "followers"
          ? "http://localhost:5000/api/follows/followers"
          : "http://localhost:5000/api/follows/following";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log(response.data)
        setUserList(response.data);
        setModalTitle(type === "followers" ? "Followers" : "Following");
        setModalType(type);  // Set the modal type to either "followers" or "following"
        setShowModal(true);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");  // Reset modal type when closing
  };

  const handleEditProfileClick = () => {
    setModalType("edit");  // Set modal type to "edit" for profile edit
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true while submitting
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.fullName);  // Ensure correct key
      formDataToSend.append("bio", formData.bio);
      if (formData.profilePicture) {
        formDataToSend.append("profile_picture", formData.profilePicture); // Ensure correct key
      }
  
      const response = await axios.patch(
        "http://localhost:5000/api/users/update",
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        // Update the user information after a successful update
        setShowModal(false);
        // Update userInfo with new data
        userInfo.fullName = response.data.user.full_name;
        userInfo.bio = response.data.user.bio;
        userInfo.profilePicture = response.data.user.profile_picture;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);  // Set loading to false after submission
    }
  };
  console.log(`${userInfo.profilePicture.replace(/\\/g, "/")}`)
  return (
    <div className="profile-header">
      <img
        className="profile-picture"
        // src={
        //   userInfo.profilePicture
        //     ? `http://localhost:5000/${userInfo.profilePicture.replace(/\\/g, "/")}`
        //     : "/default-image.jpg"
        // }
        src = "https://scontent.fdac15-1.fna.fbcdn.net/v/t39.30808-6/468724735_1997070924099879_611926233773208972_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFURfjEKe-C0JOdXIi7-WFFdnX_r1ZRKm92df-vVlEqb5hALH4HrV0ih-CWIMdUB_wc-NqhjxEs7gHyDE3lfIGF&_nc_ohc=qfTM61WfUq8Q7kNvgHHoe7O&_nc_zt=23&_nc_ht=scontent.fdac15-1.fna&_nc_gid=AYZBTI_4DqqFN0sD_Rc9w4a&oh=00_AYBv45BgCY9-vcSbcPir42j8mgam7JqIJIBwXqNFMcZdBA&oe=67634C27"
        alt="Profile"
      />
      <div className="profile-info">
        <h1>{userInfo.fullName}</h1>
        <p className="profile-bio">{userInfo.bio}</p>
        <div className="profile-stats">
          <span
            className="stats-item clickable"
            onClick={() => handleShowUsers("followers")}
          >
            Followers: {followersCount}
          </span>
          <span
            className="stats-item clickable"
            onClick={() => handleShowUsers("following")}
          >
            Following: {followingCount}
          </span>
        </div>
        <button className="edit-profile-btn" onClick={handleEditProfileClick}>
          Edit Profile
        </button>
      </div>

      {showModal && modalType === "edit" && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio:</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture:</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <button type="submit" className="save-changes-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
            <button className="close-modal-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {showModal && (modalType === "followers" || modalType === "following") && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalTitle}</h2>
            <ul>
              {userList.map((user) => (
                <li key={user.id}>{user.full_name}</li>
              ))}
            </ul>
            <button className="close-modal-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
