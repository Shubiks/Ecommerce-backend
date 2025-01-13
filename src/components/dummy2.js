import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './component_styles/products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract category filter from URL query parameters and update state
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const initialCategory = query.get("category");

    if (initialCategory) {
      // Ensure the category is set as selected based on URL
      setSelectedCategories([initialCategory]);
    }
  }, [location.search]);

  // Fetch categories for the dropdown filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("access_token");

        const response = await fetch("http://127.0.0.1:8000/api/categories/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected categories (filtering by category ID)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        // Prepare the API URL with category filter based on selectedCategories
        const apiUrl = `http://127.0.0.1:8000/api/products/?page=${currentPage}${
          selectedCategories.length > 0
            ? `&category_id=${selectedCategories[0]}`
            : ""
        }`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again.");
      }
    };

    // Only fetch products when selectedCategories are set (either initially from URL or after selection)
    if (selectedCategories.length > 0) {
      fetchProducts();
    } else {
      // If no category is selected, fetch all products
      setProducts([]);
      setTotalPages(0);
    }
  }, [currentPage, selectedCategories]); // Trigger fetch when selectedCategories or currentPage changes

  // Handle category selection in the filter
  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      // If the category is already selected, deselect it
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      // Otherwise, select the category
      setSelectedCategories([categoryId]);
    }
  };

  // Update the URL with selected categories to reflect the changes in the filter
  useEffect(() => {
    if (selectedCategories.length > 0) {
      // Update the URL with the selected category
      navigate(`/products/?category=${selectedCategories[0]}`, { replace: true });
    } else {
      // If no category is selected, clear the category from the URL
      navigate(`/products`, { replace: true });
    }
  }, [selectedCategories, navigate]);

  return (
    <div>
      <h1 className="header">Products</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Filter Dropdown */}
      <div className="filter-dropdown">
        <button className="dropdown-button">Filter by Category</button>
        <div className="dropdown-content">
          {categories.map((category) => (
            <label key={category.category_id} className="dropdown-item">
              <input
                type="radio" // Use radio button for single selection
                checked={selectedCategories.includes(category.category_id.toString())}
                onChange={() => handleCategoryChange(category.category_id.toString())}
              />
              {category.category_name}
            </label>
          ))}
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Image</th>
            <th>Category</th>
            <th>Available Stock</th>
            <th>Marked Price</th>
            <th>Discount Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>{product.name}</td>
              <td>
                {product.image && (
                  <img
                    src={`http://127.0.0.1:8000${product.image}`}
                    alt={product.name}
                    width="100"
                  />
                )}
              </td>
              <td>{product.category_name}</td>
              <td>{product.available_stock}</td>
              <td>{product.marked_price}</td>
              <td>{product.discount_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
