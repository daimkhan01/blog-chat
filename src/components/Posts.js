import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";

const Posts = ({ user }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [editPost, setEditPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newPostId, setNewPostId] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setNewPostId(data.length + 1);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  };

  const fetchComments = (postId) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then((response) => response.json())
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
    localStorage.removeItem("authenticatedUser");
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
    <div className="container-main">
      <div className="header">
        <span>Welcome, {user?.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h2>Blog Posts</h2>
      <div>
        <h3>Create New Post</h3>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>

      {editPost && (
        <div>
          <h3>Edit Post</h3>
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
            onChange={(e) => setEditPost({ ...editPost, body: e.target.value })}
          />
          <button onClick={handleUpdatePost}>Update Post</button>
          <button onClick={() => setEditPost(null)}>Cancel</button>
        </div>
      )}

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => handleEditPost(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            <button onClick={() => fetchComments(post.id)}>
              Load Comments
            </button>

            {/* Render comments */}
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

            {/* Comment form */}
            <CommentForm
              postId={post.id}
              addComment={(newComment) => addComment(post.id, newComment)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
