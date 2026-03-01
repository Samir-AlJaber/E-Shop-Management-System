import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./ProductsPage.css";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchProducts(parsed);
    } else {
      fetchProducts(null);
    }
  }, []);

  const fetchProducts = async (currentUser) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/get_products.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: currentUser?.role || "",
          owner_id: currentUser?.reference_id || 0
        })
      }
    );

    const data = await response.json();

    if (data.success) {
      setProducts(data.products);
    }
  };

  const openDeleteConfirm = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct || !user) return;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/delete_product.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct.product_id,
          role: user.role,
          owner_id: user.reference_id
        })
      }
    );

    const data = await response.json();

    if (data.success) {
      fetchProducts(user);
    } else {
      alert(data.message);
    }

    setShowConfirm(false);
    setSelectedProduct(null);
  };

  const handleBuy = (product) => {
    navigate("/place-order", { state: { product } });
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <div className="content-wrapper">
        <div className="products-container">
          <h2>Products</h2>

          {user?.role === "owner" && (
            <button
              className="add-product-btn"
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </button>
          )}

          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product.product_id}>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">BDT {product.price}</p>

                  <p
                    className={`stock ${
                      product.stock_quantity > 0
                        ? "in-stock"
                        : "out-stock"
                    }`}
                  >
                    {product.stock_quantity > 0
                      ? `In Stock (${product.stock_quantity})`
                      : "Out of Stock"}
                  </p>
                </div>

                <div className="card-actions">
                  {user?.role === "customer" &&
                    product.stock_quantity > 0 && (
                      <button
                        className="buy-btn"
                        onClick={() => handleBuy(product)}
                      >
                        Buy
                      </button>
                    )}

                  {user?.role === "owner" && (
                    <button
                      className="delete-btn"
                      onClick={() => openDeleteConfirm(product)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedProduct?.name}</strong>?
            </p>

            <div className="confirm-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-logout-btn"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProductsPage;