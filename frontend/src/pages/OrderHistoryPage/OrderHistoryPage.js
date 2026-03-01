import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./OrderHistoryPage.css";

function OrderHistoryPage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user && user.role === "customer") {
      fetch(`${process.env.REACT_APP_API_URL}/get_customer_orders.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: user.reference_id })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setOrders(data.orders);
        });
    }
  }, [user]);

  if (!user || user.role !== "customer") {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="app-wrapper">
      <Navbar />

      <div className="content-wrapper">
        <div className="history-container">
          <h2>My Orders</h2>

          {orders.length === 0 ? (
            <p className="no-orders">No orders found.</p>
          ) : (
            orders.map((order) => (
              <div className="order-card" key={order.order_id}>
                <div className="order-header">
                  <span>Order ID: #{order.order_id}</span>
                  <span className="status">{order.status}</span>
                </div>

                <p><strong>Product:</strong> {order.product_name}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Total:</strong> BDT {order.total_amount}</p>

                <div className="delivery-box">
                  <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
                  <p><strong>City:</strong> {order.city}</p>
                  {order.postal_code && (
                    <p><strong>Postal Code:</strong> {order.postal_code}</p>
                  )}
                  <p><strong>Payment:</strong> {order.payment_method}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderHistoryPage;