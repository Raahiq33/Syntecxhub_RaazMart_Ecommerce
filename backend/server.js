
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "RaazMart Backend Running Successfully!",
    status: "OK",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "RaazMart API is working",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// Reuse the MongoDB connection across requests
let connectionPromise;

function connectDatabase() {
  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error("MONGO_URI is missing"));
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("MongoDB Connected Successfully!");
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

// Connect before handling API requests
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    try {
      await connectDatabase();
      return app(req, res);
    } catch (error) {
      console.error("Database connection failed:", error.message);
      return res.status(503).json({
        message: "Database temporarily unavailable",
      });
    }
  };
} else {
  const PORT = process.env.PORT || 5000;

  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`RaazMart Backend running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
}
