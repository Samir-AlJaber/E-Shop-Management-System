import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import "./OwnerOrdersPage.css";

function OwnerOrdersPage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const [outOfArea, setOutOfArea] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = useCallback(() => {
    if (!user) return;

    fetch(`${process.env.REACT_APP_API_URL}/get_owner_orders.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner_id: user.reference_id,
        role: user.role
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders);
        else setOrders([]);
      });
  }, [user]);

  useEffect(() => {
    if (user && user.role === "owner") {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  if (!user || user.role !== "owner") {
    return <Navigate to="/products" replace />;
  }

  const handleAction = async () => {
    if (!selectedOrder) return;

    if (actionType === "accept") {
      await fetch(`${process.env.REACT_APP_API_URL}/accept_order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrder.order_id,
          owner_id: user.reference_id,
          role: user.role
        })
      });
    }

    if (actionType === "reject") {
      await fetch(`${process.env.REACT_APP_API_URL}/reject_order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrder.order_id,
          owner_id: user.reference_id,
          role: user.role,
          out_of_area: outOfArea
        })
      });
    }

    setSelectedOrder(null);
    setActionType("");
    setOutOfArea(false);
    fetchOrders();
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <div className="content-wrapper owner-orders-page">
        <div className="owner-orders-container">
          <h2>Owner Order Dashboard</h2>

          {orders.length === 0 ? (
            <p className="no-orders">No orders available.</p>
          ) : (
            <div className="order-grid">
              {orders.map(order => (
                <div className="order-card" key={order.order_id}>
                  <div className="order-header">
                    <span>Order #{order.order_id}</span>
                    <span className={`status ${order.status}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p><strong>Customer:</strong> {order.customer_name}</p>
                  <p><strong>Email:</strong> {order.customer_email}</p>
                  <p><strong>Total:</strong> BDT {order.total_amount}</p>

                  <div className="delivery-box">
                    <p><strong>Address:</strong> {order.delivery_address}</p>
                    <p><strong>City:</strong> {order.city}</p>
                    {order.postal_code && (
                      <p><strong>Postal Code:</strong> {order.postal_code}</p>
                    )}
                    <p><strong>Payment:</strong> {order.payment_method}</p>
                  </div>

                  {order.status === "pending" && (
                    <div className="action-buttons">
                      <button
                        className="accept-btn"
                        onClick={() => {
                          setSelectedOrder(order);
                          setActionType("accept");
                        }}
                      >
                        Accept
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => {
                          setSelectedOrder(order);
                          setActionType("reject");
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {order.status === "order_confirmed" && (
                    <div className="action-buttons">
                      <button
                        className="accept-btn"
                        onClick={() => navigate(`/assign-delivery/${order.order_id}`)}
                      >
                        Assign Delivery
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>
              {actionType === "accept"
                ? "Confirm Order Acceptance"
                : "Confirm Order Rejection"}
            </h3>

            <p>Order #{selectedOrder.order_id}</p>

            {actionType === "reject" && (
              <div className="checkbox-section">
                <input
                  type="checkbox"
                  checked={outOfArea}
                  onChange={() => setOutOfArea(!outOfArea)}
                />
                <label>Out of delivery area</label>
              </div>
            )}

            <div className="confirm-actions">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setActionType("");
                  setOutOfArea(false);
                }}
              >
                Cancel
              </button>

              <button onClick={handleAction}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default OwnerOrdersPage;