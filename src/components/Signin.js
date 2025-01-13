import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import './component_styles/signin.css';
function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store token in cookies with a 1-hour expiration
        Cookies.set("access_token", data.access_token);

        setMessage(data.message || "Signin successful!");
        setUsername("");
        setPassword("");

        // Add console log here to check if navigate is being called
        console.log("Redirecting to categories...");
        navigate("/categories"); // Redirect to categories page after signin
      } else {
        setMessage(data.message || "Signin failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Signin error:", error);
    }
  };

  return (
    <div>
      <h1>Signin</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Signin</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signin;
