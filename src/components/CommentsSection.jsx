import React, { useState } from "react";
import axios from "axios";

const CommentsSection = ({
  post,
  toggleCommentsVisibility,
  handleCommentSubmit,
  newComment,
  handleCommentChange,
  updatePostComments
}) => {
  const [editingComment, setEditingComment] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");

  const handleEditClick = (comment) => {
    setEditingComment(comment.id);
    setUpdatedContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedComments = post.comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: response.data.updatedContent }
          : comment
      );
      post.comments = updatedComments;
      setEditingComment(null);
      setUpdatedContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const updatedComments = post.comments.filter(
      (comment) => comment.id !== commentId
    );
    updatePostComments(post.id, updatedComments); // Update parent state immediately
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
      // Optionally revert state if API call fails
      updatePostComments(post.id, post.comments);
    }
  };
  

  return (
    <div className="comments">
      <button
        onClick={() => toggleCommentsVisibility(post.id)}
        className="comment-toggle-btn"
      >
        {post.showComments ? "Hide Comments" : "Show Comments"}
      </button>

      {post.showComments && (
        <>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment"
          ></textarea>
          <button
            onClick={() => handleCommentSubmit(post.id)}
            className="comment-submit-btn"
          >
            Add Comment
          </button>
          {post.comments?.map((comment) => (
            <div key={comment.id} className="comment">
              {editingComment === comment.id ? (
                <>
                  <textarea
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                  ></textarea>
                  <button
                    onClick={() => handleUpdateComment(comment.id)}
                    className="comment-update-btn"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingComment(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>{comment.full_name}:</strong>
                  <p>{comment.content}</p>
                  {comment.user_id === post.user_id && ( // Only show for the comment owner
                    <>
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="comment-edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="comment-delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CommentsSection;
