
const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE ORDER - Customer
router.post("/", protect, async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const { fullName, phone, address, city } =
      deliveryAddress || {};

    if (
      [fullName, phone, address, city].some(
        (value) =>
          typeof value !== "string" || !value.trim()
      )
    ) {
      return res.status(400).json({
        message: "All delivery details are required",
      });
    }

    const quantities = new Map();

    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.product) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid cart item",
        });
      }

      const id = String(item.product);

      quantities.set(
        id,
        (quantities.get(id) || 0) + item.quantity
      );
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const [id, quantity] of quantities) {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      totalAmount += product.price * quantity;
    }

    // Demo checkout: stock is checked but not deducted.
    // Production needs atomic stock reservation and
    // order creation in a MongoDB transaction.
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
      },
      paymentMethod: "Cash on Delivery",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
});

// GET MY ORDERS - Customer
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error.message);

    res.status(500).json({
      message: "Failed to load orders",
    });
  }
});

// GET ALL ORDERS - Admin Only
router.get(
  "/admin/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      console.error(
        "Get all orders error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to load admin orders",
      });
    }
  }
);

// UPDATE ORDER STATUS - Admin Only
router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.status = status;
      await order.save();

      res.json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(
        "Update order status error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to update order status",
      });
    }
  }
);

module.exports = router;
