# 🛒 RaazMart – MERN E-Commerce Store

A full-stack e-commerce web application developed as part of the **Syntecxhub Web Development Internship – Task 4**.

## 🌐 Live Demo

**Live Website:** https://raazmart-frontend.vercel.app

**Backend API:** https://syntecxhub-raaz-mart-ecommerce.vercel.app

**GitHub Repository:** https://github.com/Raahiq33/Syntecxhub_RaazMart_Ecommerce

## 🚀 Features

### Customer Features

- User Registration and Login
- Product Browsing and Search
- Shopping Cart Management
- Product Quantity Adjustment
- Cash on Delivery Checkout
- Order History and Tracking

### Admin Features

- Admin Authentication and Authorization
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

**Deployment**
- Vercel – Frontend
- Vercel – Backend
- MongoDB Atlas – Cloud Database

## 📁 Project Structure

```text
Syntecxhub_RaazMart_Ecommerce/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── vercel.json
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/Raahiq33/Syntecxhub_RaazMart_Ecommerce.git
cd Syntecxhub_RaazMart_Ecommerce
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

Start the backend:

```bash
node server.js
```

### 3. Frontend Setup

Open another terminal from the project root:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
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

## 🧪 Testing

The following features were successfully tested on the deployed application:

- Product Browsing
- User Registration
- User Login
- Add to Cart
- Shopping Cart Management
- Cash on Delivery Checkout
- Customer Order History
- Admin Dashboard
- Add, Edit and Delete Products
- View Customer Orders
- Update Order Status

## 📝 Project Notes

This project was developed for educational and internship demonstration purposes.

It is not intended for real commercial transactions without additional security, inventory management and production hardening.

## 👨‍💻 Developer

**Mohamed Raahiq**

**GitHub:** https://github.com/Raahiq33

Developed as part of the **Syntecxhub Web Development Internship**.
