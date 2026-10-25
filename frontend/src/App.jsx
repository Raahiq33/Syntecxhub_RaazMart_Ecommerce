
import { useEffect, useState } from "react";
import { getProducts } from "./api";
import Auth from "./Auth";
import Checkout from "./Checkout";
import MyOrders from "./MyOrders";
import AdminDashboard from "./AdminDashboard";
import AdminOrders from "./AdminOrders";
import "./App.css";

function App() {
  // PRODUCTS
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  // SEARCH AND CART
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // AUTHENTICATION
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // CHECKOUT, ORDERS AND ADMIN
  const [showCheckout, setShowCheckout] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminOrders, setShowAdminOrders] = useState(false);

  // LOAD PRODUCTS FROM MONGODB
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductError("");

      const data = await getProducts();

      if (!Array.isArray(data)) {
        throw new Error("Invalid products response");
      }

      setProducts(data);
    } catch (error) {
      setProductError(
        error.message || "Failed to load products"
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // SEARCH PRODUCTS
  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  // LOGIN / REGISTER SUCCESS
  const handleAuthSuccess = (data) => {
    setUser(data.user);
    setToken(data.token);
    setShowAuth(false);
  };

  // LOGOUT
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    setShowCart(false);
    setShowAuth(false);
    setShowCheckout(false);
    setShowMyOrders(false);
    setShowAdmin(false);
    setShowAdminOrders(false);
  };

  // ADD TO CART
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return previousCart;
        }

        return previousCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousCart,
        { ...product, quantity: 1 },
      ];
    });
  };

  // INCREASE QUANTITY
  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item._id === id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // REMOVE PRODUCT
  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item._id !== id)
    );
  };

  // CART COUNT
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // CART TOTAL
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // PRICE FORMAT
  const formatPrice = (price) =>
    `LKR ${Number(price).toLocaleString("en-LK")}`;

  // OPEN CHECKOUT
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your shopping cart is empty.");
      return;
    }

    if (!user || !token) {
      setShowAuth(true);
      return;
    }

    setShowMyOrders(false);
    setShowAdmin(false);
    setShowAdminOrders(false);
    setShowCheckout(true);
  };

  // ORDER SUCCESS
  const handleOrderSuccess = () => {
    setCart([]);
    setShowCart(false);
    setShowCheckout(false);
    setShowAdmin(false);
    setShowAdminOrders(false);
    setShowMyOrders(true);
  };

  // OPEN MY ORDERS
  const handleMyOrders = () => {
    if (!user || !token) {
      setShowAuth(true);
      return;
    }

    setShowCart(false);
    setShowCheckout(false);
    setShowAdmin(false);
    setShowAdminOrders(false);
    setShowMyOrders(true);
  };

  // OPEN ADMIN DASHBOARD
  const handleAdminDashboard = () => {
    if (!user || user.role !== "admin" || !token) {
      return;
    }

    setShowCart(false);
    setShowCheckout(false);
    setShowMyOrders(false);
    setShowAdminOrders(false);
    setShowAdmin(true);
  };

  // OPEN ADMIN ORDERS
  const handleAdminOrders = () => {
    if (!user || user.role !== "admin" || !token) {
      return;
    }

    setShowCart(false);
    setShowCheckout(false);
    setShowMyOrders(false);
    setShowAdmin(false);
    setShowAdminOrders(true);
  };

  // REFRESH PRODUCTS AFTER ADMIN CHANGES
  const handleProductsChanged = async () => {
    await loadProducts();
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <h2 className="logo">🛒 RaazMart</h2>

        <input
          className="search-input"
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <div className="navbar-actions">
          {user ? (
            <div className="user-profile">
              <span>👤 {user.name}</span>

              {/* MY ORDERS BUTTON */}
              <button
                type="button"
                className="login-btn"
                onClick={handleMyOrders}
              >
                📦 My Orders
              </button>

              {/* ADMIN BUTTONS */}
              {user.role === "admin" && (
                <>
                  <button
                    type="button"
                    className="login-btn"
                    onClick={handleAdminDashboard}
                  >
                    ⚙️ Admin Dashboard
                  </button>

                  <button
                    type="button"
                    className="login-btn"
                    onClick={handleAdminOrders}
                  >
                    📋 Manage Orders
                  </button>
                </>
              )}

              {/* LOGOUT BUTTON */}
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="login-btn"
              onClick={() => setShowAuth(true)}
            >
              👤 Login / Sign Up
            </button>
          )}

          {/* CART BUTTON */}
          <button
            type="button"
            className="cart-count"
            onClick={() => {
              setShowMyOrders(false);
              setShowAdmin(false);
              setShowAdminOrders(false);
              setShowCart(!showCart);
            }}
          >
            🛍️ Cart ({cartCount})
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <h1>Welcome to RaazMart</h1>

        <p>
          Discover amazing products at affordable prices.
        </p>

        <button
          type="button"
          className="shop-btn"
          onClick={() =>
            document
              .getElementById("products")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Shop Now
        </button>
      </section>

      {/* PRODUCTS SECTION */}
      <main
        id="products"
        className="products-section"
      >
        <div className="section-heading">
          <h2>Featured Products</h2>

          <p>
            Find your favourite products at great prices.
          </p>
        </div>

        {loadingProducts && (
          <p className="empty-message">
            Loading products...
          </p>
        )}

        {productError && (
          <p className="empty-message">
            ⚠️ {productError}
          </p>
        )}

        {!loadingProducts && !productError && (
          <>
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article
                  className="product-card"
                  key={product._id}
                >
                  <div className="product-image">
                    {product.emoji || "📦"}
                  </div>

                  <p className="category">
                    {product.category}
                  </p>

                  <h3>{product.name}</h3>

                  <p className="price">
                    {formatPrice(product.price)}
                  </p>

                  {product.description && (
                    <p className="product-description">
                      {product.description}
                    </p>
                  )}

                  <p className="stock-info">
                    {product.stock > 0
                      ? `In Stock: ${product.stock}`
                      : "Out of Stock"}
                  </p>

                  <button
                    type="button"
                    className="add-btn"
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                  >
                    {product.stock > 0
                      ? "🛒 Add to Cart"
                      : "Out of Stock"}
                  </button>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="empty-message">
                No products found. Try another search.
              </p>
            )}
          </>
        )}
      </main>

      {/* SHOPPING CART */}
      {showCart && (
        <section className="cart-section">
          <div className="cart-heading">
            <h2>🛒 Your Shopping Cart</h2>

            <button
              type="button"
              className="close-btn"
              onClick={() => setShowCart(false)}
            >
              Close
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="empty-message">
              Your shopping cart is empty.
            </p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={item._id}
                >
                  <div className="cart-product">
                    <span className="cart-emoji">
                      {item.emoji || "📦"}
                    </span>

                    <div>
                      <h3>{item.name}</h3>

                      <p>
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item._id)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      disabled={
                        item.quantity >= item.stock
                      }
                      onClick={() =>
                        increaseQuantity(item._id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong className="item-total">
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </strong>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="cart-summary">
                <h3>
                  Total: {formatPrice(cartTotal)}
                </h3>

                <button
                  type="button"
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* MY ORDERS SECTION */}
      {showMyOrders && token && (
        <MyOrders
          token={token}
          onClose={() => setShowMyOrders(false)}
        />
      )}

      {/* ADMIN DASHBOARD SECTION */}
      {showAdmin &&
        user?.role === "admin" &&
        token && (
          <AdminDashboard
            token={token}
            onClose={() => setShowAdmin(false)}
            onProductsChanged={handleProductsChanged}
          />
        )}

      {/* ADMIN ORDERS SECTION */}
      {showAdminOrders &&
        user?.role === "admin" &&
        token && (
          <AdminOrders
            token={token}
            onClose={() => setShowAdminOrders(false)}
          />
        )}

      {/* FOOTER */}
      <footer>
        <p>
          © 2026 RaazMart. All Rights Reserved.
        </p>

        <p>
          Syntecxhub Web Development Internship Project
        </p>
      </footer>

      {/* LOGIN / SIGN UP */}
      {showAuth && (
        <Auth
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}

      {/* CHECKOUT */}
      {showCheckout && (
        <Checkout
          cart={cart}
          token={token}
          onClose={() => setShowCheckout(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

export default App;
