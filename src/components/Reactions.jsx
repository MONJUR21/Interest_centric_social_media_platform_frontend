const Reactions = ({ postId, toggleReactions, reactions }) => {
  return (
    <div className="reactions-section">
      <button onClick={() => toggleReactions(postId, "like")}>
        👍 Like ({reactions?.like || 0})
      </button>
      <button onClick={() => toggleReactions(postId, "love")}>
        ❤️ Love ({reactions?.love || 0})
      </button>
      <button onClick={() => toggleReactions(postId, "angry")}>
        😡 Angry ({reactions?.angry || 0})
      </button>
    </div>
  );
};

export default Reactions;

  