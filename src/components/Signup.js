import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './component_styles/signup.css';

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!username || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Display success message and clear the input fields
        setMessage(data.message || "Signup successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/signin");
      } else {
        // Display error message from the API
        setMessage(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false); // Reset loading state after the API call
    }
  };

  return (
    <div>
      <h1>Signup</h1>
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
