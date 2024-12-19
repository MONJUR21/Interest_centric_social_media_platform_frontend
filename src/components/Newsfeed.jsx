import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Newsfeed.css";
import CommentsSection from "./CommentsSection";

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const postsResponse = await axios.get(
          "http://localhost:5000/api/posts",
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
  const handleCommentSubmit = async (postId) => {
    if (newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/comments",
        { post_id: postId, content: newComment },
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
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/post/${postId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to fetch comments.");
      return [];
    }
  };

  const updatePostComments = (postId, updatedComments) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: updatedComments } : post
      )
    );
  };

  return (
    <div className="newsfeedd">
      <div className="profile-posts-section">
        {posts.length > 0 ? (
          <div className="profile-posts">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <img
                  className="post-image"
                  src={
                    post.image
                      ? `http://localhost:5000/${post.image.replace(
                          /\\/g,
                          "/"
                        )}`
                      : "/default-image.jpg"
                  }
                  alt={post.title}
                />
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p className="post-author">By {post.author}</p>
                  <p className="post-date">{post.date}</p>
                  <p className="post-interest">
                    <strong>Interest:</strong> {post.interest}
                  </p>
                  <p
                    className={`post-text ${
                      post.showFullContent ? "show-full" : ""
                    }`}
                  >
                    {post.showFullContent
                      ? post.content
                      : `${post.content.substring(0, 150)}...`}
                  </p>
                  {post.content.length > 150 && (
                    <button
                      className="see-more-btn"
                      onClick={() => toggleContentVisibility(post.id)}
                    >
                      {post.showFullContent ? "Show Less" : "See More"}
                    </button>
                  )}
                </div>

                <div className="reactions-section">
                  <button onClick={() => toggleReactions(post.id, "like")}>
                    👍 Like ({post.reactions?.like || 0})
                  </button>
                  <button onClick={() => toggleReactions(post.id, "love")}>
                    ❤️ Love ({post.reactions?.love || 0})
                  </button>
                  <button onClick={() => toggleReactions(post.id, "angry")}>
                    😡 Angry ({post.reactions?.angry || 0})
                  </button>
                </div>

                <CommentsSection
                  post={post}
                  toggleCommentsVisibility={toggleCommentsVisibility}
                  newComment={newComment}
                  handleCommentChange={handleCommentChange}
                  handleCommentSubmit={handleCommentSubmit}
                  setNewComment={setNewComment}
                  updatePostComments={updatePostComments}
                />
              </div>
            ))}
          </div>
        ) : (
          <span class="loader"></span>
        )}
      </div>
    </div>
  );
};

export default Newsfeed;
