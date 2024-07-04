import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = ({ onAuth }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([
    {
      email: "daim@khan",
      id: 1,
      name: "Muhammad Daim Khan",
      password: "daim",
    },
    {
      email: "naveed@khan",
      id: 2,
      name: "Hafiz Naveed Khan",
      password: "naveed",
    },
    {
      email: "usman@khan",
      id: 3,
      name: "Dr.Usman Khan",
      password: "usman",
    },
    {
      email: "kashif@khan",
      id: 4,
      name: "Kashif Khan",
      password: "kashif",
    },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      const newUser = { id: users.length + 1, ...formData };
      setUsers([...users, newUser]);
      onAuth(newUser);
      navigate("/posts");
    } else {
      const user = users.find((user) => user.email === formData.email);

      if (user && user.password === formData.password) {
        onAuth(user);
        console.log("Successful login");
        navigate("/posts");
      } else {
        alert("Invalid Email or Password");
        console.log("Invalid Email or Password");
      }
    }
  };

  console.log("Registered users", users);

  return (
    <div className="container">
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
