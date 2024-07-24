import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  fetchPost,
  fetchComments,
  fetchPosts,
  updatePost,
  deletePost,
  updateComment,
  deleteComment,
} from "../api";
import ScrollButton from "../components/ScrollButton/ScrollButton";
import NotFound from "./NotFound";

const PostCommentView = ({ user }) => {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({ title: "", body: "" });
  const [editComment, setEditComment] = useState({ id: null, body: "" });

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postData = await fetchPost(commentId);
        setPost(postData);
        setEditPost({ title: postData.title, body: postData.body });

        const commentsData = await fetchComments(commentId);
        setComments(commentsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [commentId]);

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handleUpdatePost = async () => {
    try {
      await updatePost(post.id, editPost);
      setPost({ ...post, ...editPost });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditComment({ id: comment.id, body: comment.body });
  };

  const handleUpdateComment = async () => {
    try {
      await updateComment(editComment.id, { body: editComment.body });
      setComments(
        comments.map((comment) =>
          comment.id === editComment.id
            ? { ...comment, body: editComment.body }
            : comment
        )
      );
      setEditComment({ id: null, body: "" });
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <NotFound />;

  return (
    <div className="container-main">
      <div className="comment-view">
        {isEditing ? (
          <div className="comment-view">
            <h2>Edit Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={editPost.title}
              onChange={(e) =>
                setEditPost({ ...editPost, title: e.target.value })
              }
            />
            <textarea
              className="txt-area"
              placeholder="Content"
              value={editPost.body}
              onChange={(e) =>
                setEditPost({ ...editPost, body: e.target.value })
              }
            />
            <button onClick={handleUpdatePost}>Update Post</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className="comment-view">
            <h2>Post Title : {post.title}</h2>
            <strong>Post Content: </strong>
            <p>{post.body}</p>
            {user && (
              <div>
                <button onClick={() => setIsEditing(true)}>Edit Post</button>
                <button className="btn" onClick={handleDeletePost}>
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
        <h3>Comments:</h3>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                {editComment.id === comment.id ? (
                  <div>
                    <textarea
                      className="txt-area"
                      value={editComment.body}
                      onChange={(e) =>
                        setEditComment({ ...editComment, body: e.target.value })
                      }
                    />
                    <button onClick={handleUpdateComment}>Save</button>
                    <button
                      onClick={() => setEditComment({ id: null, body: "" })}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>{comment.body}</p>
                    {user && (
                      <div>
                        <button onClick={() => handleEditComment(comment)}>
                          Edit
                        </button>
                        <button
                          className="btn"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments available.</p>
        )}
        <Link to="/">Go to Posts</Link>
      </div>
      <div className="related-posts">
        <h3>Related Posts:</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h4>{post.title}</h4>
              </Link>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      </div>
      <ScrollButton />
    </div>
  );
};

export default PostCommentView;
