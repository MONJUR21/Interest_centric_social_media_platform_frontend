import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Friends.css";

const FriendSuggestions = () => {
  const [users, setUsers] = useState([]); // List of users excluding the logged-in user
  const [followedUsers, setFollowedUsers] = useState(new Set()); // Track followed users

  useEffect(() => {
    const fetchUsersAndFollowing = async () => {
      try {
        const token = localStorage.getItem("token"); // Auth token
        if (!token) {
          console.error("Token not found");
          return;
        }

        // Fetch all users excluding the logged-in user
        const usersResponse = await axios.get("http://localhost:5000/api/follows/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch users the logged-in user is already following
        const followingResponse = await axios.get("http://localhost:5000/api/follows/following", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (usersResponse.status === 200 && followingResponse.status === 200) {
          const fetchedUsers = usersResponse.data;
          const followingData = followingResponse.data;

          setUsers(fetchedUsers);
          setFollowedUsers(new Set(followingData.map((user) => user.id))); // Initialize followed users
        }
      } catch (error) {
        console.error("Error fetching users or following data:", error);
      }
    };

    fetchUsersAndFollowing();
  }, []);

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/follows",
        { followUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setFollowedUsers((prev) => new Set(prev.add(userId))); // Update follow status
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/follows/unfollow",
        { userId }, // Adjusted payload for backend to derive followerId
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setFollowedUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="usersfollow">
    <div className="friend-suggestions">
      <h2>Friend Suggestions</h2>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.full_name}</h3>
            <div>
              {followedUsers.has(user.id) ? (
                <button onClick={() => handleUnfollow(user.id)} className="unfollow-btn">
                  Unfollow
                </button>
              ) : (
                <button onClick={() => handleFollow(user.id)} className="follow-btn">
                  Follow
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default FriendSuggestions;
