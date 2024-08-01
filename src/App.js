import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "./components/Auth";
import Posts from "./components/Posts";
import NotFound from "./components/NotFound";
import PostCommentView from "./components/PostCommentView";
import CreatePost from "./components/CreatePost";
import Layout from "./components/Layout ";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  const addNewPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Layout user={user} onLogout={handleLogout} />}
        >
          <Route
            index
            element={<Posts user={user} posts={posts} setPosts={setPosts} />}
          />
          <Route
            path="posts/newpost"
            element={<CreatePost user={user} addNewPost={addNewPost} />}
          />
          <Route
            path="posts/:postId"
            element={<PostCommentView user={user} />}
          />
          <Route
            path="posts"
            element={
              user ? (
                <Posts user={user} posts={posts} setPosts={setPosts} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
