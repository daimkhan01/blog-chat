import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPost, fetchComments, fetchPosts } from "../api";
import ScrollButton from "../components/ScrollButton/ScrollButton";
import NotFound from "./NotFound";

const PostCommentView = () => {
  const { commentId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch the post using commentId
        const postData = await fetchPost(commentId);
        setPost(postData);

        // Fetch comments for the post
        const commentsData = await fetchComments(commentId);
        setComments(commentsData);
      } catch (error) {
        console.error(
          `Error fetching post and comments for comment ${commentId}:`,
          error
        );
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

    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    if (storedUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (!post) {
    // return "Loading...";
    return <NotFound />;
  }

  return (
    <div className="container-main">
      <div className="heade">
        <Link className="head" to="/">
          <h2>Blog App - Post View {post.id}</h2>
        </Link>

        {isLoggedIn ? (
          <h3>Welcome to Blog App</h3>
        ) : (
          <Link to="/auth">
            <button>Sign In</button>
          </Link>
        )}
      </div>
      <div className="comment-view">
        <h2>Post Title: {post.title}</h2>
        <p>Post Content: {post.body}</p>
        <h3>Comments:</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.body}</p>
            </li>
          ))}
          <Link to="/">Go to Posts</Link>
        </ul>
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
