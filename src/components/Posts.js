import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useNavigate, Link } from "react-router-dom";
import { fetchPosts, fetchComments } from "../api";
import Footer from "./Footer";

const Posts = ({ user, onLogout, showFooter }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [editPost, setEditPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newPostId, setNewPostId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  // To Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        setPosts(data);
        setNewPostId(data.length + 1);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const fetchCommentsForPost = (postId) => {
    fetchComments(postId)
      .then((data) => {
        const existingComments = comments[postId] || [];
        const mergedComments = [...existingComments, ...data];
        setComments({ ...comments, [postId]: mergedComments });
      })
      .catch((error) =>
        console.error(`Error fetching comments for post ${postId}:`, error)
      );
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.body) {
      alert("Title and Content are required ⚠");
      return;
    }

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.id = newPostId;
        setNewPostId(newPostId + 1);
        setPosts([data, ...posts]);
        setNewPost({ title: "", body: "" });
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  const handleDeletePost = (postId) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  const handleEditPost = (post) => {
    setEditPost(post);
  };

  const handleUpdatePost = () => {
    const updatedPosts = posts.map((post) =>
      post.id === editPost.id ? { ...post, ...editPost } : post
    );
    setPosts(updatedPosts);
    setEditPost(null);
  };

  const handleEditComment = (postId, updatedComment) => {
    const updatedComments = comments[postId].map((comment) =>
      comment.id === updatedComment.id ? updatedComment : comment
    );
    setComments({ ...comments, [postId]: updatedComments });
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await fetch(
        `https://jsonplaceholder.typicode.com/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      const updatedComments = comments[postId].filter(
        (comment) => comment.id !== commentId
      );
      setComments({ ...comments, [postId]: updatedComments });
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const addComment = (postId, newComment) => {
    const updatedComments = {
      ...comments,
      [postId]: [...(comments[postId] || []), newComment],
    };
    setComments(updatedComments);
  };

  return (
    <>
      <div className="container-main">
        <div className="header">
          <Link className="head" to="/posts/1">
            <h2>{user ? "Blog App Post's" : "Blog App"}</h2>
          </Link>
          {user ? (
            <>
              <span className="animated-underline">Welcome, {user.name}</span>
              {user.imageURL && <img src={user.imageURL} alt={user.name} />}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/auth">
              <button>Sign In</button>
            </Link>
          )}
        </div>

        {user && (
          <div>
            <h3>Create New Post</h3>
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            <textarea
              placeholder="Content"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <button onClick={handleCreatePost}>Create Post</button>
          </div>
        )}
        {editPost && (
          <div>
            <h3>Edit App</h3>
            <input
              type="text"
              placeholder="Title"
              value={editPost.title}
              onChange={(e) =>
                setEditPost({ ...editPost, title: e.target.value })
              }
            />
            <textarea
              placeholder="Content"
              value={editPost.body}
              onChange={(e) =>
                setEditPost({ ...editPost, body: e.target.value })
              }
            />
            <button onClick={handleUpdatePost}>Update Post</button>
            <button onClick={() => setEditPost(null)}>Cancel</button>
          </div>
        )}
        <ul>
          {currentPosts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              {user ? (
                <>
                  <button onClick={() => handleEditPost(post)}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </button>
                </>
              ) : (
                <Link to="/auth">
                  <button>Sign In to Edit/Delete</button>
                </Link>
              )}
              <button onClick={() => fetchCommentsForPost(post.id)}>
                Load Comments
              </button>

              {/* comment on post */}
              {comments[post.id] && (
                <div>
                  <h4>Comments:</h4>
                  <ul>
                    {comments[post.id].map((comment) => (
                      <li key={comment.id}>
                        <Comment
                          comment={comment}
                          user={user}
                          onUpdate={(updatedComment) =>
                            handleEditComment(post.id, updatedComment)
                          }
                          onDelete={(commentId) =>
                            handleDeleteComment(post.id, commentId)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {user && (
                <CommentForm
                  postId={post.id}
                  addComment={(newComment) => addComment(post.id, newComment)}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Pagination controls */}
        <div>
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(posts.length / postsPerPage) },
              (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    onClick={() => paginate(index + 1)}
                    className="page-link"
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      {showFooter && <Footer />}
    </>
  );
};

export default Posts;
