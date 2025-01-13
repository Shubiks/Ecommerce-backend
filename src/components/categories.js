import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './component_styles/categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/categories/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/signin");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleShowAllProducts = () => {
    navigate("/products"); // Navigate to the Products page without filters
  };

  return (
    <div>
      <h1 className="header">Categories</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Categories Table */}
      <table className="category-table">
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Category Name</th>
            <th>Date of Creation</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.category_id}>
              <td>{category.category_id}</td>
              <td>
                <Link to={`/products/?category=${category.category_id}`}>
                  {category.category_name}
                </Link>
              </td>
              <td>{new Date(category.date_of_creation).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to navigate to the Products page */}
      <button onClick={handleShowAllProducts} className="show-products-button">
        All Products
      </button>
    </div>
  );
};

export default Categories;
