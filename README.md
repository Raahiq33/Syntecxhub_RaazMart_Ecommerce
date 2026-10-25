
# 🛒 RaazMart – MERN E-Commerce Store

A full-stack e-commerce web application developed as part of the Syntecxhub Web Development Internship.

## 🚀 Features

### Customer Features
- User Registration and Login
- Product Browsing and Search
- Shopping Cart Management
- Product Quantity Adjustment
- Cash on Delivery Checkout
- Order History and Tracking

### Admin Features
- Admin Authentication
- Add New Products
- Edit Product Details
- Delete Products
- View Customer Orders
- Update Order Status

## 🛠️ Technologies Used

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt

## 📁 Project Structure

Syntecxhub_Ecommerce_Store/
- backend/
  - models/
  - routes/
  - middleware/
  - server.js
- frontend/
  - src/
  - public/
- README.md

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
cd Syntecxhub_Ecommerce_Store
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

Start Backend:

```bash
node server.js
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite.

## 💳 Payment Method

Cash on Delivery (COD).

No online payment gateway is integrated.

## 📦 Order Management

Customers can place orders and view their order history.

Administrators can view orders and update their status:

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

## 🔒 Security

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Role-based admin authorization
- Environment variables for sensitive credentials

## 📝 Project Notes

This is an internship demonstration project, not a production-ready e-commerce platform.

## 👨‍💻 Developer

Mohamed Raahiq

**GitHub:** https://github.com/Raahiq33

Developed for the Syntecxhub Web Development Internship.
