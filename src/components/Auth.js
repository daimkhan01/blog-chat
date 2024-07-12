import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import user1 from "./assets/daim.jpeg";

const Auth = ({ onAuth }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imageURL: "",
  });
  const [users, setUsers] = useState([
    {
      email: "daim@khan",
      id: 1,
      name: "Muhammad Daim Khan",
      password: "Daimkhan1@",
      imageURL: user1,
    },
  ]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    if (storedUser) {
      onAuth(storedUser);
      navigate("/posts");
    }
  }, [navigate, onAuth]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (!validatePassword(formData.password)) {
        alert(
          "Password must be at least 8 characters include uppercase letter, number, and special character. ⚠"
        );
        return;
      }

      const newUser = { id: users.length + 1, ...formData };
      setUsers([...users, newUser]);
      localStorage.setItem("authUser", JSON.stringify(newUser));
      onAuth(newUser);
      navigate("/posts");
    } else {
      const user = users.find((user) => user.email === formData.email);

      if (user && user.password === formData.password) {
        localStorage.setItem("authUser", JSON.stringify(user));
        onAuth(user);
        navigate("/posts");
      } else {
        alert("Invalid Email or Password");
      }
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <div onClick={handleClose}>
        <span>&times;</span>
      </div>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <>
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          name="email"
          type="email"
          placeholder="eg. daim@khan"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
      </button>
    </div>
  );
};

export default Auth;
