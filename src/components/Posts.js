import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchPosts } from "../api";

const Posts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const navigate = useNavigate();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchAndSetPosts = () => {
    fetchPosts()
      .then((data) => {
        const postsWithUserId = data.map((post) => ({
          ...post,
          userId: Math.floor(Math.random() * 5) + 1,
        }));
        const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        setPosts([...storedPosts, ...postsWithUserId]);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  };

  useEffect(() => {
    fetchAndSetPosts();
  }, []);

  const openPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="container-main">
      {user && (
        <Link to="/posts/newpost">
          <h1 className="crt-pst">Create New Post</h1>
        </Link>
      )}
      <div className="post-main">
        <ul className="post-container">
          {currentPosts.map((post) => (
            <li className="post-container-list" key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <button onClick={() => openPost(post.id)}>Open Post</button>
            </li>
          ))}
        </ul>
      </div>

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
  );
};

export default Posts;
