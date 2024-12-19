import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";
import PostForm from "./PostForm";
import PostCard from "./PostCard";
import "./Profile.css";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    profilePicture: "",
    bio: "",
  });
  const [followersCount, setFollowersCount] = useState(0); // Number of followers
  const [followingCount, setFollowingCount] = useState(0); // Number of users the logged-in user is following
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: "",
    interest: "",
  });
  const [newComment, setNewComment] = useState("");
  const [editPost, setEditPost] = useState(null);
  const interests = [
    "Outdoor Adventure",
    "Technology",
    "Music",
    "Art",
    "Travel",
    "Sports",
    "Food",
  ];

  const [postCounts, setPostCounts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const postsResponse = await axios.get(
          "http://localhost:5000/api/posts/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(postsResponse.data)) {
          const postsWithDetails = await Promise.all(
            postsResponse.data.map(async (post) => {
              const [commentsResponse, reactionsResponse] = await Promise.all([
                axios.get(
                  `http://localhost:5000/api/comments/post/${post.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                ),
                axios.get(
                  `http://localhost:5000/api/reactions/post/${post.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                ),
              ]);

              return {
                ...post,
                comments: commentsResponse.data,
                reactions: reactionsResponse.data.reduce((acc, reaction) => {
                  acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                  return acc;
                }, {}),
              };
            })
          );
          setPosts(postsWithDetails);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts and comments:", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchPostCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/posts/interests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setPostCounts(response.data);
      } catch (error) {
        console.error("Error fetching post counts:", error);
      }
    };

    fetchPostCounts();
  }, []);

  useEffect(() => {
    const fetchPostsCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/posts/interests/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setCount(response.data[0].posts_count);
      } catch (error) {
        console.error("Error fetching post counts:", error);
      }
    };

    fetchPostsCounts();
  }, [refreshCount]); // Rerun when refreshCount changes

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        const { full_name, profile_picture, bio } = response.data;

        setUserInfo({
          fullName: full_name,
          profilePicture: profile_picture || "default-profile-pic.jpg",
          bio: bio || "No bio available",
          followers: response.data.followers || 0,
          following: response.data.following || 0,
        });
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, []);
  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        const token = localStorage.getItem("token"); // Auth token
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/follows/counts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setFollowersCount(response.data.followersCount);
          setFollowingCount(response.data.followingCount);
        }
      } catch (error) {
        console.error("Error fetching follow counts:", error);
      }
    };

    fetchFollowCounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewPost({ ...newPost, image: file });
    } else {
      console.error("Selected file is not an image");
    }
  };

  const updatePostComments = (postId, updatedComments) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: updatedComments } : post
      )
    );
  };

  const updatePostCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/posts/interests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPostCounts(response.data);
    } catch (error) {
      console.error("Error updating post counts:", error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (newPost.title && newPost.content && newPost.interest) {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("title", newPost.title);
        formData.append("content", newPost.content);
        if (newPost.image) {
          formData.append("image", newPost.image);
        }

        formData.append("interest", newPost.interest);
        const response = await axios.post(
          "http://localhost:5000/api/posts",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setPosts([response.data.post, ...posts]);
        console.log(response.data.post);
        setNewPost({ title: "", content: "", image: "", interest: "" });

        // Update post counts after adding a post
        await updatePostCounts();
        setRefreshCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    }
  };

  const toggleContentVisibility = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, showFullContent: !post.showFullContent }
          : post
      )
    );
  };

  const toggleReactions = async (postId, reactionType) => {
    try {
      const token = localStorage.getItem("token");

      // Make the API call to toggle reaction
      const response = await axios.post(
        "http://localhost:5000/api/reactions",
        { post_id: postId, type: reactionType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            const currentReactions = { ...post.reactions };

            switch (response.data.message) {
              case "Reaction removed successfully":
                currentReactions[reactionType] = Math.max(
                  0,
                  (currentReactions[reactionType] || 0) - 1
                );
                break;

              case "Reaction updated successfully":
                const previousType = response.data.previousType;
                if (previousType) {
                  currentReactions[previousType] = Math.max(
                    0,
                    (currentReactions[previousType] || 0) - 1
                  );
                }
                currentReactions[reactionType] =
                  (currentReactions[reactionType] || 0) + 1;
                break;

              case "Reaction added successfully":
                currentReactions[reactionType] =
                  (currentReactions[reactionType] || 0) + 1;
                break;

              default:
                console.error(
                  "Unexpected response from server:",
                  response.data.message
                );
                break;
            }

            return { ...post, reactions: currentReactions };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error toggling reactions:", error);
      alert("Failed to update reaction. Please try again.");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const toggleCommentsVisibility = async (postId) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      );

      const targetPost = updatedPosts.find((post) => post.id === postId);
      if (targetPost?.showComments && !targetPost.comments?.length) {
        fetchComments(postId);
      }

      return updatedPosts;
    });
  };

  const fetchComments = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Unauthorized: No token found");
      return []; // Return empty comments to prevent errors
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return []; // Return empty array if there is an error fetching comments
    }
  };

  const handleCommentSubmit = async (postId) => {
    console.log(postId);
    if (newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/comments",
        {
          post_id: postId,
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        const updatedPosts = posts.map((post) =>
          post.id === postId
            ? { ...post, comments: response.data.comments }
            : post
        );
        setPosts(updatedPosts);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post.id !== postId));
      await updatePostCounts();
      setRefreshCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const handleEditPost = (post) => {
    setEditPost(post);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (editPost.title && editPost.content && editPost.interest) {
      try {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("title", editPost.title);
        formData.append("content", editPost.content);
        formData.append("interest", editPost.interest);

        if (editPost.image instanceof File) {
          formData.append("image", editPost.image);
        }

        const response = await axios.put(
          `http://localhost:5000/api/posts/${editPost.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data.post);
        setPosts(
          posts.map((post) =>
            post.id === editPost.id ? response.data.post : post
          )
        );
        setEditPost(null);
        await updatePostCounts();
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <ProfileHeader
          userInfo={userInfo}
          followersCount={followersCount}
          followingCount={followingCount}
        />
        {count > 0 && (
          <div className="bar">
            <BarChart
              width={600}
              height={300}
              margin={{ top: 20, right: 30, left: 20, bottom: 65 }}
              data={postCounts}
            >
              <XAxis dataKey="interest" angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="post_count" fill="#8884d8" />
            </BarChart>
            <h1>Total Post: {count}</h1>
          </div>
        )}

        {editPost ? (
          <form className="edit-post-form" onSubmit={handleUpdatePost}>
            <input
              type="text"
              name="title"
              value={editPost.title}
              onChange={(e) =>
                setEditPost({ ...editPost, title: e.target.value })
              }
              placeholder="Title"
              required
            />
            <textarea
              name="content"
              value={editPost.content}
              onChange={(e) =>
                setEditPost({ ...editPost, content: e.target.value })
              }
              placeholder="Content"
              required
            />
            <select
              name="interest"
              value={editPost.interest}
              onChange={(e) =>
                setEditPost({ ...editPost, interest: e.target.value })
              }
              required
            >
              {interests.map((interest) => (
                <option key={interest} value={interest}>
                  {interest}
                </option>
              ))}
            </select>
            <input
              type="file"
              name="image"
              onChange={(e) =>
                setEditPost({ ...editPost, image: e.target.files[0] })
              }
            />
            <button type="submit">Update Post</button>
            <button type="button" onClick={() => setEditPost(null)}>
              Cancel
            </button>
          </form>
        ) : (
          <PostForm
            newPost={newPost}
            setNewPost={setNewPost}
            handlePostSubmit={handlePostSubmit}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            interests={interests}
          />
        )}
        <div className="posts">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              toggleContentVisibility={toggleContentVisibility}
              toggleReactions={toggleReactions}
              toggleCommentsVisibility={toggleCommentsVisibility}
              newComment={newComment}
              handleCommentChange={handleCommentChange}
              handleCommentSubmit={handleCommentSubmit}
              handleEditPost={handleEditPost}
              handleDeletePost={handleDeletePost}
              setNewComment={setNewComment}
              updatePostComments={updatePostComments}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
