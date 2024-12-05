import Reactions from './Reactions';
import CommentsSection from './CommentsSection';

const PostCard = ({
  post,
  toggleContentVisibility,
  toggleReactions,
  toggleCommentsVisibility,
  newComment,
  handleCommentChange,
  handleCommentSubmit,
  handleEditPost,
  handleDeletePost,
  setNewComment,
  updatePostComments
}) => {
  const imageUrl = post.image ? `http://localhost:5000/${post.image.replace(/\\/g, '/')}` : '/default-image.jpg';

  return (
    <div key={post.id} className="post-card">
      <img
        className="post-image"
        src={imageUrl}
        alt={post.title}
      />
      <div className="post-content">
        <h3>{post.title}</h3>
        <p className="post-author">By {post.full_name}</p>
        <p className="post-date">{post.date}</p>
        <p className="post-interest">
          <strong>Interest:</strong> {post.interest}
        </p>
        <p className={`post-text ${post.showFullContent ? 'show-full' : ''}`}>
          {post.showFullContent ? post.content : `${post.content.substring(0, 150)}...`}
        </p>
        {post.content.length > 150 && (
          <button className="see-more-btn" onClick={() => toggleContentVisibility(post.id)}>
            {post.showFullContent ? 'Show Less' : 'See More'}
          </button>
        )}

        <Reactions postId={post.id} toggleReactions={toggleReactions} reactions={post.reactions} />

        <CommentsSection
          post={post}
          toggleCommentsVisibility={toggleCommentsVisibility}
          newComment={newComment}
          handleCommentChange={handleCommentChange}
          handleCommentSubmit={handleCommentSubmit}
          setNewComment={setNewComment}
          updatePostComments={updatePostComments}
        />

        <div className="post-actions">
          <button className="edit-btn" onClick={() => handleEditPost(post)}>Edit</button>
          <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
