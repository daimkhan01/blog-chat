import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "./components/Auth";
import Posts from "./components/Posts";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth onAuth={handleAuth} />} />
        <Route
          path="/posts"
          element={user ? <Posts user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
