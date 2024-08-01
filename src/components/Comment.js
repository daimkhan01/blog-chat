import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <p>{comment.body}</p>
    </div>
  );
};

export default Comment;
