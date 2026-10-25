
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Wireless Headphones",
    price: 4500,
    category: "Electronics",
    emoji: "🎧",
    description: "High-quality wireless headphones",
    stock: 20,
  },
  {
    name: "Smart Watch",
    price: 8500,
    category: "Electronics",
    emoji: "⌚",
    description: "Smart watch with fitness tracking",
    stock: 15,
  },
  {
    name: "Running Shoes",
    price: 6500,
    category: "Fashion",
    emoji: "👟",
    description: "Comfortable running shoes",
    stock: 25,
  },
  {
    name: "Backpack",
    price: 3200,
    category: "Accessories",
    emoji: "🎒",
    description: "Durable everyday backpack",
    stock: 30,
  },
  {
    name: "Sunglasses",
    price: 2500,
    category: "Fashion",
    emoji: "🕶️",
    description: "Stylish sunglasses",
    stock: 18,
  },
  {
    name: "Laptop",
    price: 145000,
    category: "Electronics",
    emoji: "💻",
    description: "Laptop for study and work",
    stock: 10,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected!");

    for (const product of products) {
      await Product.updateOne(
        { name: product.name },
        { $set: product },
        { upsert: true }
      );
    }

    console.log("6 RaazMart Products Added Successfully!");
  } catch (error) {
    console.error("Seed Error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
