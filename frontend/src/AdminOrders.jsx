
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "./api";

const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders({ token, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders(token);

      if (!Array.isArray(data)) {
        throw new Error("Invalid orders response");
      }

      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [token]);

  async function handleStatusChange(orderId, status) {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      await updateOrderStatus(token, orderId, status);

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      );

      setMessage("Order status updated successfully!");
    } catch (err) {
      setError(
        err.message || "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const formatPrice = (price) =>
    `LKR ${Number(price).toLocaleString("en-LK")}`;

  return (
    <section className="cart-section">
      <div className="cart-heading">
        <h2>📋 Admin Orders Management</h2>

        <button
          type="button"
          className="close-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {error && (
        <p style={{ color: "red" }}>⚠️ {error}</p>
      )}

      {message && (
        <p style={{ color: "green" }}>✅ {message}</p>
      )}

      {loading ? (
        <p>Loading customer orders...</p>
      ) : orders.length === 0 ? (
        <p>No customer orders found.</p>
      ) : (
        orders.map((order) => (
          <article
            key={order._id}
            className="product-card"
            style={{
              marginBottom: "20px",
              textAlign: "left",
              padding: "20px",
            }}
          >
            <h3>Order #{order._id.slice(-8)}</h3>

            <p>
              <strong>Customer:</strong>{" "}
              {order.user?.name || "Unknown"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.user?.email || "Unavailable"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Delivery:</strong>{" "}
              {order.deliveryAddress?.fullName},{" "}
              {order.deliveryAddress?.address},{" "}
              {order.deliveryAddress?.city}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {order.deliveryAddress?.phone}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {order.paymentMethod}
            </p>

            <h4>Products</h4>

            {order.items.map((item, index) => (
              <p key={index}>
                {item.name} × {item.quantity} —{" "}
                {formatPrice(item.price * item.quantity)}
              </p>
            ))}

            <h3>
              Total: {formatPrice(order.totalAmount)}
            </h3>

            <label
              htmlFor={`status-${order._id}`}
              style={{
                display: "block",
                marginTop: "12px",
                marginBottom: "8px",
              }}
            >
              <strong>Order Status</strong>
            </label>

            <select
              id={`status-${order._id}`}
              value={order.status}
              disabled={updatingId === order._id}
              onChange={(event) =>
                handleStatusChange(
                  order._id,
                  event.target.value
                )
              }
              style={{
                padding: "10px",
                borderRadius: "8px",
                width: "100%",
                maxWidth: "300px",
              }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {updatingId === order._id && (
              <p>Updating status...</p>
            )}
          </article>
        ))
      )}
    </section>
  );
}

export default AdminOrders;
