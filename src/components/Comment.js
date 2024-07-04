import React, { useState } from "react";

const Comment = ({ comment, user, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.body);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(comment.body);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...comment, body: editedContent });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <textarea
            className="cmnt-txt"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>{comment.body}</p>
          {user && (
            <div>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
