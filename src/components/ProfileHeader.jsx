import React, { useState } from "react";
import axios from "axios";
import "./ProfileHeader.css";

const ProfileHeader = ({ userInfo, followersCount, followingCount }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [userList, setUserList] = useState([]);

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
        setUserList(response.data);
        setModalTitle(type === "followers" ? "Followers" : "Following");
        setShowModal(true);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="profile-header">
      <img
        className="profile-picture"
        src={
          userInfo.profilePicture
            ? `http://localhost:5000/${userInfo.profilePicture.replace(/\\/g, "/")}`
            : "/default-image.jpg"
        }
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
        <button className="edit-profile-btn">Edit Profile</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalTitle}</h2>
            <ul>
              {userList.length > 0 ? (
                userList.map((user) => (
                  <li key={user.id} className="modal-user-item">
                    <img
                      src={
                        user.profilePicture
                          ? `http://localhost:5000/${user.profilePicture.replace(/\\/g, "/")}`
                          : "/default-image.jpg"
                      }
                      alt={user.username}
                      className="user-avatar"
                    />
                    <div>
                      <span className="user-fullname">{user.full_name}</span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="no-users-message">No users found</p>
              )}
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
