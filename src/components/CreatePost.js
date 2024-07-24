import React, { useState } from "react";

const CreatePost = ({ user }) => {
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [posts, setPosts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editCommentIndex, setEditCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentPostIndex, setEditCommentPostIndex] = useState(null);

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.body) {
      alert("Title and Content are required ⚠");
      return;
    }

    if (editIndex !== null) {
      const updatedPosts = posts.map((post, index) =>
        index === editIndex ? { ...post, ...newPost } : post
      );
      setPosts(updatedPosts);
      setEditIndex(null);
    } else {
      setPosts([...posts, { ...newPost, comments: [] }]);
    }

    setNewPost({ title: "", body: "" });
  };

  const handleEditPost = (index) => {
    setNewPost(posts[index]);
    setEditIndex(index);
  };

  const handleDeletePost = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);
    if (editIndex === index) {
      setNewPost({ title: "", body: "" });
      setEditIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setNewPost({ title: "", body: "" });
    setEditIndex(null);
  };

  const handleAddComment = (postIndex) => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty ⚠");
      return;
    }

    const updatedPosts = posts.map((post, index) =>
      index === postIndex
        ? { ...post, comments: [...(post.comments || []), commentText] }
        : post
    );
    setPosts(updatedPosts);
    setCommentText("");
  };

  const handleEditComment = (postIndex, commentIndex, comment) => {
    setEditCommentPostIndex(postIndex);
    setEditCommentIndex(commentIndex);
    setEditCommentText(comment);
  };

  const handleUpdateComment = () => {
    if (!editCommentText.trim()) {
      alert("Comment cannot be empty ⚠");
      return;
    }

    const updatedPosts = posts.map((post, index) =>
      index === editCommentPostIndex
        ? {
            ...post,
            comments: post.comments.map((comment, i) =>
              i === editCommentIndex ? editCommentText : comment
            ),
          }
        : post
    );
    setPosts(updatedPosts);
    setEditCommentIndex(null);
    setEditCommentText("");
  };

  const handleCancelCommentEdit = () => {
    setEditCommentIndex(null);
    setEditCommentText("");
  };

  const handleDeleteComment = (postIndex, commentIndex) => {
    const updatedPosts = posts.map((post, index) =>
      index === postIndex
        ? {
            ...post,
            comments: post.comments.filter((_, i) => i !== commentIndex),
          }
        : post
    );
    setPosts(updatedPosts);
  };

  return (
    <div className="container-main">
      <h1 className="crt-psts">
        {editIndex !== null ? "Edit Post ..." : "Create Post ..."}
      </h1>
      <input
        type="text"
        placeholder="Title"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      />
      <textarea
        className="txt-area"
        placeholder="Content"
        value={newPost.body}
        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
      />
      <button onClick={handleCreatePost}>
        {editIndex !== null ? "Update Post" : "Create Post"}
      </button>
      {editIndex !== null && <button onClick={handleCancelEdit}>Cancel</button>}

      {posts.length > 0 && (
        <div className="posts-list">
          <h3>All Posts:</h3>
          <ul>
            {posts.map((post, index) => (
              <li key={index} className="post-item">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <button onClick={() => handleEditPost(index)}>Edit</button>
                <button className="btn" onClick={() => handleDeletePost(index)}>
                  Delete
                </button>

                <div className="comments-section">
                  <h4>Comments:</h4>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={() => handleAddComment(index)}>
                    Add Comment
                  </button>
                  {post.comments.length > 0 && (
                    <ul>
                      {post.comments.map((comment, commentIndex) => (
                        <li key={commentIndex} className="comment-item">
                          {editCommentIndex === commentIndex &&
                          editCommentPostIndex === index ? (
                            <>
                              <input
                                type="text"
                                value={editCommentText}
                                onChange={(e) =>
                                  setEditCommentText(e.target.value)
                                }
                              />
                              <button onClick={handleUpdateComment}>
                                Update Comment
                              </button>
                              <button onClick={handleCancelCommentEdit}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <p>{comment}</p>
                              <button
                                onClick={() =>
                                  handleEditComment(
                                    index,
                                    commentIndex,
                                    comment
                                  )
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="btn"
                                onClick={() =>
                                  handleDeleteComment(index, commentIndex)
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
