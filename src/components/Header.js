import React from "react";
import { Link } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  return (
    <div className="header container-main ">
      <Link className="head" to="/posts">
        <h2>{user ? "Blog App Post's" : "Blog App"}</h2>
      </Link>
      {user ? (
        <>
          <span className="animated-underline">Welcome, {user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <Link to="/auth">
          <button>Sign In</button>
        </Link>
      )}
    </div>
  );
};

export default Header;
