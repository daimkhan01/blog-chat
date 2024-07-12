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
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Posts user={user} onLogout={handleLogout} showFooter />}
        />
        <Route path="/posts/:commentId" element={<PostCommentView />} />
        <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
        <Route
          path="/posts"
          element={
            user ? (
              <Posts user={user} onLogout={handleLogout} showFooter />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
