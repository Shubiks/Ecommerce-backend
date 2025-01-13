// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Categories from "./components/categories";
import Navbar from "./components/navbar"; 
import Products from "./components/product";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element = {
            <h1>Welcome to Home Page.</h1>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          
          {/* Wrap the protected routes with PrivateRoute */}
          <Route
            path="/categories"
            element={<PrivateRoute element={<Categories />} />}
          />
          <Route path="/products" element={<Products />} />
          <Route
            path="/products/:categoryId"
            element={<Products />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
