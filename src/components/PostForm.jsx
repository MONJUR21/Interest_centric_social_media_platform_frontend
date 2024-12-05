const PostForm = ({ newPost, setNewPost, handlePostSubmit, handleInputChange, handleImageChange, interests }) => (
    <div className="post-form-section">
      <h2>What's on your mind?</h2>
      <form className="post-form" onSubmit={handlePostSubmit}>
        <input
          type="text"
          name="title"
          value={newPost.title}
          onChange={handleInputChange}
          placeholder="Post Title"
          className="post-input"
        />
        <textarea
          name="content"
          value={newPost.content}
          onChange={handleInputChange}
          placeholder="Write your thoughts..."
          className="post-input"
          rows="3"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="post-input"
        />
        <div className="interest-selection">
          <label>Choose Interest: </label>
          <select
            name="interest"
            value={newPost.interest}
            onChange={handleInputChange}
            className="post-input"
          >
            <option value="">Select Interest</option>
            {interests.map((interest, index) => (
              <option key={index} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="post-submit-btn">
          Post
        </button>
      </form>
    </div>
  );
  
  export default PostForm;
  