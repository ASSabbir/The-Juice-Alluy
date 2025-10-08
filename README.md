# ☕ Coffee Shop Management System

A **full-stack web application** for managing a modern coffee shop. This system enables customers to browse coffee items, place and track orders, and receive live updates — while the admin can manage orders, monitor sales, and analyze business performance via an intuitive dashboard.

---

## 🎯 Project Overview

The **Coffee Shop Management System** is designed to streamline both customer and administrative operations for a coffee shop.  
It provides two main interfaces:

- **Customer Side (Frontend):** Browse, order, track, and review coffee products.
- **Admin Dashboard (Backend UI):** Manage orders, update order status, track sales, and view insights.

---

## 🧭 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#️-tech-stack)
3. [Folder Structure](#-project-structure)
4. [Installation](#️-installation)
5. [Configuration](#-configuration)
6. [Usage](#-usage)
7. [API Overview](#-api-overview)
8. [Contributors & Task Division](#-contributors--task-division)
9. [Troubleshooting](#-troubleshooting)
10. [License](#-license)

---

## 🖥️ Features

### **Customer Side**
- Browse coffee products in elegant card layouts.  
- View product details and pricing.  
- Add to cart and place an order.  
- Track real-time order status *(Pending → Preparing → Ready)*.  
- Receive instant notifications when an order is ready *(via WebSocket)*.  
- Submit reviews for purchased items.

### **Admin Dashboard**
- Manage and update incoming orders.  
- Accept or reject orders with one click.  
- Update order status and notify customers.  
- Generate monthly sales reports and business summaries.  
- Analyze business performance (total sales, top-selling items).

### **Additional Pages**
- **Home Page:** Shop highlights and featured coffees.  
- **Products Page:** All available coffee items.  
- **Contact Us Page:** Contact form and location map.  
- **Blog Page:** Shop stories and news.  
- **Login/Signup Page:** Authentication for both customer and admin.

---

## ⚙️ Tech Stack

### **Frontend**
- **React.js** – UI framework  
- **React Router** – Page routing  
- **Tailwind CSS** – Styling  
- **Axios** – API calls  
- **TanStack Query / Context API** – State management

### **Backend**
- **Express.js** – REST API server  
- **MongoDB** – Database  
- **Mongoose** – ODM  
- **JWT** – Authentication  
- **Socket.io** – Real-time notifications

### **Other Tools**
- **Version Control:** Git + GitHub  
- **Deployment:** Vercel (Frontend), Render / Heroku (Backend)

---

## 📂 Project Structure

```
coffee-shop-management/
│
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/         # Images & icons
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # App pages (Home, Products, Contact, Dashboard)
│   │   ├── context/        # Context API / Auth context
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Helper functions
│   │   ├── App.js
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/             # DB connection, environment setup
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth and validation middlewares
│   ├── utils/              # Utility functions
│   ├── index.js            # Entry point
│   └── package.json
│
├── docs/                   # Documentation (Proposal, API Docs)
└── README.md
```

---

## ⚡ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/coffee-shop-management.git
cd coffee-shop-management
```

### 2️⃣ Install dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd ../server
npm install
```

---

## ⚙️ Configuration

Create a `.env` file inside the **server/** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

If using Socket.io for notifications:
```env
SOCKET_PORT=5001
```

---

## 🚀 Usage

### Start the backend server:
```bash
cd server
npm run dev
```

### Start the frontend:
```bash
cd client
npm run dev
```

Your app will be available at:  
👉 **Frontend:** `http://localhost:5173`  
👉 **Backend API:** `http://localhost:5000`

---

## 📡 API Overview

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/products` | GET | Get all coffee products |
| `/api/products/:id` | GET | Get single product details |
| `/api/orders` | POST | Place a new order |
| `/api/orders/:id/status` | PATCH | Update order status (Admin) |
| `/api/auth/login` | POST | Login (User/Admin) |
| `/api/auth/register` | POST | Signup (User/Admin) |

---

## 👨‍💻 Contributors & Task Division

### **Day 1: Setup & Core Pages**
- **Dev 1:** Frontend setup (React, Tailwind, Routing, Navbar, Footer, Home)  
- **Dev 2:** Backend setup (Express, MongoDB models)  
- **Dev 3:** Authentication (Firebase, login/signup, protected routes)

### **Day 2–3: Customer Features**
- **Dev 1:** Home page  
- **Dev 2:** Products page (cards, details)  
- **Dev 3:** Customer dashboard, login, signup

### **Day 4: Admin Dashboard**
- **Dev 1:** Admin UI  
- **Dev 2:** Admin API (orders, status, stats)  
- **Dev 3:** Notification system (Socket.io)

### **Day 5: Reports & Final Pages**
- **Dev 1:** Contact & About pages  
- **Dev 2:** Sales backend (monthly aggregation)  
- **Dev 3:** Admin sales chart visualization

### **Day 6–7: Testing & Deployment**
- Integration testing, bug fixes, documentation  
- Deployment on **Vercel** (Frontend) & **Render/Heroku** (Backend)

---

## 🧩 Troubleshooting

| Issue | Possible Solution |
|-------|--------------------|
| MongoDB connection fails | Check `MONGO_URI` in `.env` file |
| CORS error | Ensure backend `CLIENT_URL` matches frontend URL |
| JWT token not working | Verify `JWT_SECRET` and token expiration |
| Socket not connecting | Ensure correct port and server initialization |

---

## 📜 License

This project is licensed under the **MIT License**.  
You’re free to use, modify, and distribute this software with proper attribution.

---

### ❤️ Developed with passion by the Coffee Shop Team

> *“Life begins after coffee — now manage it better.”* ☕
