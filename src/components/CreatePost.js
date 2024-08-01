import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CreatePost = ({ addNewPost }) => {
  const { postId } = useParams();
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [posts, setPosts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editCommentIndex, setEditCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentPostIndex, setEditCommentPostIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      const postsData = JSON.parse(storedPosts);
      setPosts(postsData);

      if (postId) {
        const post = postsData.find((p) => p.id === parseInt(postId));
        if (post) {
          setNewPost({ title: post.title, body: post.body });
          setEditIndex(postsData.indexOf(post));
        }
      }
    }
  }, [postId]);

  const updateLocalStorage = (updatedPosts) => {
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.body) {
      setErrorMessage("Title and Body are required ⚠");
      return;
    }

    let updatedPosts;
    if (editIndex !== null) {
      updatedPosts = posts.map((post, index) =>
        index === editIndex ? { ...post, ...newPost } : post
      );
      setEditIndex(null);
    } else {
      const post = { ...newPost, id: Date.now(), comments: [] };
      updatedPosts = [...posts, post];
      addNewPost(post);
    }

    setPosts(updatedPosts);
    updateLocalStorage(updatedPosts);
    setNewPost({ title: "", body: "" });
    setErrorMessage("");
  };

  const handleEditPost = (index) => {
    setNewPost(posts[index]);
    setEditIndex(index);
  };

  const handleDeletePost = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);
    updateLocalStorage(updatedPosts);
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
      setErrorMessage("Comment cannot be empty ⚠");
      return;
    }

    const updatedPosts = posts.map((post, index) =>
      index === postIndex
        ? {
            ...post,
            comments: [
              ...(post.comments || []),
              { id: Date.now(), body: commentText },
            ],
          }
        : post
    );
    setPosts(updatedPosts);
    updateLocalStorage(updatedPosts);
    setCommentText("");
    setErrorMessage("");
  };

  const handleEditComment = (postIndex, commentIndex, comment) => {
    setEditCommentPostIndex(postIndex);
    setEditCommentIndex(commentIndex);
    setEditCommentText(comment.body);
  };

  const handleUpdateComment = () => {
    if (!editCommentText.trim()) {
      setErrorMessage("Comment cannot be empty ⚠");
      return;
    }

    const updatedPosts = posts.map((post, index) =>
      index === editCommentPostIndex
        ? {
            ...post,
            comments: post.comments.map((comment, i) =>
              i === editCommentIndex
                ? { ...comment, body: editCommentText }
                : comment
            ),
          }
        : post
    );
    setPosts(updatedPosts);
    updateLocalStorage(updatedPosts);
    setEditCommentIndex(null);
    setEditCommentText("");
    setErrorMessage("");
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
    updateLocalStorage(updatedPosts);
  };

  const postToShow = postId
    ? posts.find((post) => post.id === parseInt(postId))
    : null;

  return (
    <div className="container-main comment-view">
      <h1 className="crt-psts">
        {editIndex !== null ? "Edit Post ..." : "Create Post ..."}
      </h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="text"
        placeholder="Title"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      />
      <textarea
        className="txt-area"
        placeholder="Body"
        value={newPost.body}
        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
      />
      <button onClick={handleCreatePost}>
        {editIndex !== null ? "Update Post" : "Create Post"}
      </button>
      {editIndex !== null && <button onClick={handleCancelEdit}>Cancel</button>}

      {/* Display the post and its comments */}
      {postToShow && (
        <div className="post-comment">
          <h3>{postToShow.title}</h3>
          <p>{postToShow.body}</p>
          {postToShow.comments && postToShow.comments.length > 0 && (
            <div>
              <h4>Comments:</h4>
              <ul>
                {postToShow.comments.map((comment, commentIndex) => (
                  <li key={comment.id}>
                    {editCommentIndex === commentIndex &&
                    editCommentPostIndex ===
                      (postToShow.id ? posts.indexOf(postToShow) : -1) ? (
                      <>
                        <input
                          type="text"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
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
                        <p>{comment.body}</p>
                        <button
                          onClick={() =>
                            handleEditComment(
                              posts.indexOf(postToShow),
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
                            handleDeleteComment(
                              posts.indexOf(postToShow),
                              commentIndex
                            )
                          }
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input
            type="text"
            placeholder="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={() => handleAddComment(posts.indexOf(postToShow))}>
            Add Comment
          </button>
        </div>
      )}
      {!postId && (
        <div className="all-posts">
          <h3>All Posts:</h3>
          <ul>
            {posts.map((post, index) => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <button onClick={() => handleEditPost(index)}>Edit</button>
                <button className="btn" onClick={() => handleDeletePost(index)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
