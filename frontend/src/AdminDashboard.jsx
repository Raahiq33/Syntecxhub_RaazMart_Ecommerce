
import { useEffect, useRef, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./api";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  emoji: "📦",
  description: "",
  stock: "",
};

function AdminDashboard({
  token,
  onClose,
  onProductsChanged,
}) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Reference to the product form
  const formRef = useRef(null);

  // LOAD PRODUCTS
  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      if (!Array.isArray(data)) {
        throw new Error("Invalid products response");
      }

      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // HANDLE INPUT CHANGES
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  // SCROLL TO FORM
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ADD OR UPDATE PRODUCT
  const handleSubmit = async (event) => {
    event.preventDefault();

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      form.price === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      form.stock === "" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError("Please enter valid product details.");
      return;
    }

    const productData = {
      name: form.name.trim(),
      price,
      category: form.category.trim(),
      emoji: form.emoji.trim() || "📦",
      description: form.description.trim(),
      stock,
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateProduct(
          token,
          editingId,
          productData
        );

        setMessage("Product updated successfully!");
      } else {
        await addProduct(token, productData);

        setMessage("Product added successfully!");
      }

      resetForm();

      await loadProducts();

      if (onProductsChanged) {
        await onProductsChanged();
      }

      scrollToForm();
    } catch (err) {
      setError(
        err.message || "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  // EDIT PRODUCT
  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      emoji: product.emoji || "📦",
      description: product.description || "",
      stock: String(product.stock),
    });

    setError("");
    setMessage("");

    // Move to the edit form automatically
    scrollToForm();
  };

  // DELETE PRODUCT
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await deleteProduct(token, product._id);

      setMessage("Product deleted successfully!");

      resetForm();

      await loadProducts();

      if (onProductsChanged) {
        await onProductsChanged();
      }
    } catch (err) {
      setError(
        err.message || "Failed to delete product"
      );
    } finally {
      setSaving(false);
    }
  };

  // FORMAT PRICE
  const formatPrice = (price) =>
    `LKR ${Number(price).toLocaleString("en-LK")}`;

  return (
    <section className="cart-section">
      {/* DASHBOARD HEADER */}
      <div className="cart-heading">
        <h2>⚙️ Admin Dashboard</h2>

        <button
          type="button"
          className="close-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* PRODUCT FORM */}
      <div
        ref={formRef}
        style={{
          scrollMarginTop: "90px",
        }}
      >
        <h3>
          {editingId
            ? "✏️ Edit Product"
            : "➕ Add New Product"}
        </h3>

        {editingId && (
          <p style={{ color: "#2563eb" }}>
            Editing product: {form.name}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "12px",
            maxWidth: "500px",
            marginBottom: "30px",
            marginTop: "15px",
          }}
        >
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price (LKR)"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            name="emoji"
            placeholder="Product Emoji"
            value={form.emoji}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />

          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            required
          />

          {/* ADD / UPDATE BUTTON */}
          <button
            type="submit"
            className="checkout-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "💾 Update Product"
              : "➕ Add Product"}
          </button>

          {/* CANCEL EDIT */}
          {editingId && (
            <button
              type="button"
              className="close-btn"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <p style={{ color: "red" }}>
          ⚠️ {error}
        </p>
      )}

      {/* SUCCESS MESSAGE */}
      {message && (
        <p style={{ color: "green" }}>
          ✅ {message}
        </p>
      )}

      {/* MANAGE PRODUCTS */}
      <h3>📦 Manage Products</h3>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article
              className="product-card"
              key={product._id}
            >
              <div className="product-image">
                {product.emoji || "📦"}
              </div>

              <h3>{product.name}</h3>

              <p>{product.category}</p>

              <p>{formatPrice(product.price)}</p>

              <p>Stock: {product.stock}</p>

              {/* EDIT BUTTON */}
              <button
                type="button"
                className="add-btn"
                onClick={() => handleEdit(product)}
                disabled={saving}
              >
                ✏️ Edit
              </button>

              {/* DELETE BUTTON */}
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleDelete(product)}
                disabled={saving}
              >
                🗑️ Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
