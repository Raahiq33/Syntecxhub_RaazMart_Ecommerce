
import { useEffect, useState } from "react";
import { getMyOrders } from "./api";

function MyOrders({ token, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const data = await getMyOrders(token);

        if (active) {
          setOrders(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load orders");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, [token]);

  const formatPrice = (price) =>
    `LKR ${Number(price).toLocaleString("en-LK")}`;

  return (
    <section className="cart-section">
      <div className="cart-heading">
        <h2>📦 My Orders</h2>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>

      {loading && <p>Loading your orders...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>You have not placed any orders yet.</p>
      )}

      {!loading &&
        !error &&
        orders.map((order) => (
          <div
            key={order._id}
            className="product-card"
            style={{ marginBottom: "20px", padding: "20px" }}
          >
            <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString("en-LK")}
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Payment:</strong> {order.paymentMethod}
            </p>

            <hr />

            {order.items.map((item) => (
              <p key={item.product}>
                {item.name} × {item.quantity} —{" "}
                {formatPrice(item.price * item.quantity)}
              </p>
            ))}

            <hr />

            <h3>Total: {formatPrice(order.totalAmount)}</h3>
          </div>
        ))}
    </section>
  );
}

export default MyOrders;
