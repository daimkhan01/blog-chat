import React, { useState } from "react";

const CommentForm = ({ postId, addComment }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      id: Date.now(),
      postId,
      body: content,
    };

    addComment(newComment);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        required
      />
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default CommentForm;
