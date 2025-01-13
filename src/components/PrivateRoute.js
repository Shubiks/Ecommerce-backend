// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to access the cookies

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  const token = Cookies.get("access_token"); // Get the access token from cookies

  // If the user is not authenticated, redirect to the Signin page
  if (!token) {
    return <Navigate to="/signin" />;
  }

  // If the user is authenticated, render the requested element (route's component)
  return element;
};

export default PrivateRoute;
