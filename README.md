# 🛍️ VISTORA - MERN Stack E-Commerce Platform

![MERN](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern full-stack E-Commerce platform developed using the **MERN Stack** as part of the **CodeAlpha Full Stack Development Internship**. VISTORA provides a complete online shopping experience with secure authentication, product management, shopping cart, wishlist, reviews, and an admin dashboard.

---

# 🌐 Live Demo

### Frontend
https://code-alpha-vistora.vercel.app

### Backend API
https://codealpha-vistora.onrender.com

---

# ✨ Features

## 👤 User Features

- User Registration & Login
- Secure JWT Authentication
- User Profile Management
- Browse Products
- Product Details
- Shopping Cart
- Wishlist
- Product Reviews
- Place Orders
- Order History

## 🛒 Product Features

- View All Products
- Product Details
- Categories
- Product Images
- Product Pricing
- Inventory Management

## 👨‍💼 Admin Features

- Admin Dashboard
- Add Products
- Update Products
- Delete Products
- Manage Orders
- Dashboard Statistics

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- Multer
- CORS
- dotenv

## Database

- MongoDB Atlas
- Mongoose

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

# 📂 Project Structure

```
CodeAlpha_VISTORA
│
├── client
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── routes
│   │   └── App.jsx
│   ├── package.json
│   └── vercel.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/Aayushi131005/CodeAlpha_VISTORA.git
cd CodeAlpha_VISTORA
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
ADMIN_REGISTER_CODE=YOUR_ADMIN_CODE
```

Run the backend server:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder.

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

---

# 🚀 Deployment

## Frontend

Hosted on **Vercel**

https://code-alpha-vistora.vercel.app

## Backend

Hosted on **Render**

https://codealpha-vistora.onrender.com

---

# 📡 API Endpoints

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

## Products

```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Cart

```
GET    /api/cart
POST   /api/cart
PUT    /api/cart/increase/:id
PUT    /api/cart/decrease/:id
DELETE /api/cart/:id
```

## Wishlist

```
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:id
```

## Orders

```
GET    /api/orders
POST   /api/orders
```

## Reviews

```
GET    /api/reviews
POST   /api/reviews
```

## Dashboard

```
GET /api/dashboard
```

---

# 🔒 Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
ADMIN_REGISTER_CODE=YOUR_ADMIN_CODE
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

For production (Vercel):

```env
VITE_API_URL=https://codealpha-vistora.onrender.com/api
```

---

# 🚀 Future Enhancements

- Online Payment Gateway Integration
- Email Verification
- Forgot Password
- Product Filters & Sorting
- Coupons & Discounts
- Order Tracking
- Notifications
- AI Product Recommendations
- Responsive UI Improvements
- Performance Optimization

---

# 👨‍💻 Author

**Ansh Kumar**

**CodeAlpha Full Stack Development Intern**

GitHub: https://github.com/Aayushi131005

---

# 🙏 Acknowledgements

- CodeAlpha
- React
- Node.js
- Express.js
- MongoDB Atlas
- Vercel
- Render
- Tailwind CSS

---

# 📄 License

This project is licensed under the **MIT License**.

---

⭐ **If you found this project helpful, consider giving the repository a Star!**
