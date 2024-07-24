import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { Link } from "react-router-dom";
import { fetchPosts, fetchComments } from "../api";

const Posts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

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
        const postsWithUserId = data.map((post) => ({
          ...post,
          userId: Math.floor(Math.random() * 5) + 1,
        }));
        setPosts(postsWithUserId);
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
        {user && (
          <Link to="/posts/new">
            <h1 className="crt-pst">Create New Post</h1>
          </Link>
        )}
        <ul>
          {currentPosts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
              </Link>
              <p>{post.body}</p>
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
    </>
  );
};

export default Posts;
