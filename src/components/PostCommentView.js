import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPost, fetchComments } from "../api";
import ScrollButton from "../components/ScrollButton/ScrollButton";
import NotFound from "./NotFound";
import CommentForm from "../components/CommentForm";
import Comment from "../components/Comment";
import { v4 as uuidv4 } from "uuid";

const PostCommentView = ({ user }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editComment, setEditComment] = useState({ id: null, body: "" });

  useEffect(() => {
    if (!postId) {
      setError("Post ID is required");
      setLoading(false);
      return;
    }

    const fetchPostAndComments = async () => {
      try {
        const storedPosts = localStorage.getItem("posts");
        let postData;

        if (storedPosts) {
          const postsData = JSON.parse(storedPosts);
          postData = postsData.find((post) => post.id === parseInt(postId));
        }

        if (postData) {
          setPost(postData);
        } else {
          postData = await fetchPost(postId);
          setPost(postData);
        }

        const storedComments = localStorage.getItem(`comments_${postId}`);
        if (storedComments) {
          setComments(JSON.parse(storedComments));
        } else {
          const commentsData = await fetchComments(postId);
          setComments(
            commentsData.map((comment) => ({ ...comment, isNew: false }))
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  useEffect(() => {
    if (post) {
      localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    }
  }, [comments, postId, post]);

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    setComments(updatedComments);
    localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
  };

  const handleEditComment = (comment) => {
    setEditComment({ id: comment.id, body: comment.body });
  };

  const handleUpdateComment = () => {
    if (!editComment.id) return;

    if (editComment.body.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }

    const updatedComments = comments.map((comment) =>
      comment.id === editComment.id
        ? { ...comment, body: editComment.body }
        : comment
    );

    setComments(updatedComments);
    localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
    setEditComment({ id: null, body: "" });
  };

  const handleAddComment = (newComment) => {
    const newCommentWithId = { ...newComment, id: uuidv4(), isNew: true };
    const updatedComments = [...comments, newCommentWithId];

    setComments(updatedComments);
    localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <NotFound />;

  return (
    <div className="container-main">
      <div className="comment-view">
        <div className="comment-view">
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>

        <div className="comments-section">
          <h3>Comments:</h3>
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  {editComment.id === comment.id ? (
                    <div>
                      <textarea
                        value={editComment.body}
                        onChange={(e) =>
                          setEditComment({
                            ...editComment,
                            body: e.target.value,
                          })
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
                      <Comment comment={comment} />
                      {comment.isNew && user && (
                        <div>
                          <button onClick={() => handleEditComment(comment)}>
                            Edit
                          </button>
                          <button
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
          {user && (
            <CommentForm postId={post.id} addComment={handleAddComment} />
          )}
          <Link to="/">Go to Posts</Link>
        </div>
      </div>
      <ScrollButton />
    </div>
  );
};

export default PostCommentView;
