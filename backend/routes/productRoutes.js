
const express = require("express");
const Product = require("../models/Product");
const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL PRODUCTS - Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({
      message: "Failed to load products",
    });
  }
});

// GET SINGLE PRODUCT - Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch {
    res.status(400).json({
      message: "Invalid product ID",
    });
  }
});

// ADD PRODUCT - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      emoji,
      description,
      stock,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        message: "Invalid product details",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price,
      category: category.trim(),
      emoji: emoji || "📦",
      description: description || "",
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({
      message: "Failed to create product",
    });
  }
});

// UPDATE PRODUCT - Admin only
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "price",
      "category",
      "emoji",
      "description",
      "stock",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    Object.assign(product, updates);
    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(400).json({
      message: "Invalid product data or ID",
    });
  }
});

// DELETE PRODUCT - Admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch {
    res.status(400).json({
      message: "Invalid product ID",
    });
  }
});

module.exports = router;
