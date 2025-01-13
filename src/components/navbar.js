import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import './component_styles/navbar.css'; // Import the separate CSS file

const Navbar = () => {
  const navigate = useNavigate();

  // Check if user is authenticated by checking the access token in cookies
  const isAuthenticated = !!Cookies.get("access_token");

  const handleLogout = () => {
    Cookies.remove("access_token"); // Remove token from cookies
    navigate("/signin"); // Redirect to Signin page
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        My App {/* Add your app name/logo here */}
      </div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
          <button className="navbar-button" onClick={() => navigate("/categories")} > Categories</button>

          <button onClick={handleLogout} className="logout-button" aria-label="Logout">Logout</button>

          </>
        ) : (
          <>
            <button onClick={() => navigate("/signup")} className="navbar-link" aria-label="Signup">
              Signup
            </button>
            <button onClick={() => navigate("/signin")} className="navbar-link" aria-label="Signin">
              Signin
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
