# PremiumStore E-Commerce Platform

A professional, full-stack E-Commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). Developed by **Sneha D M** as the final submission for **Task 04**, this project features a fully responsive UI, secure JWT authentication, dynamic product catalog sorting, advanced shopping cart management, and a robust administrator dashboard.

## 🚀 Key Features

### For Customers
* **Comprehensive Product Catalog**: Browse 20+ diverse products across Footwear, Clothing, Accessories, Home & Lifestyle, and Electronics.
* **Advanced Search & Filtering**: Dynamically slice products by Category, exact Keyword, Price Brackets, and custom Sorting (Newest, Top Rated, Price Low/High).
* **Deep Product Details**: View detailed descriptions, stock status, large format imagery, original price markdown percentage drops, and integrated customer reviews.
* **Intelligent Cart & Wishlist**: Real-time contextual quantity management tightly coupled with MongoDB persistence logic. 
* **Secure Checkout System**: Multi-step checkout tunnel collecting shipping payloads securely, supporting **Cash on Delivery** and mock encrypted Card portals. Success splashed natively with generated Order IDs.
* **User Accounts**: Highly secure bcrypt password hashing and persistent JWT sessions mapping to detailed order historical ledgers.

### For Administrators
* **Unified Dashboard Gateway**: Role-gated portal (protected by JWT middleware) yielding total situational awareness.
* **Financial Analytics**: Real-time computational statistics (Total Global Sales, Total Orders, Total Customers).
* **Inventory Control**: Directly manage product levels, categories, original crossover prices, and visibility.
* **Fulfillment Management**: Monitor and execute order status overrides (Pending, Processing, Completed, Return Requested) seamlessly across the backend.
* **User Management**: Regulate platform access and forcibly execute account deletions.

## 💻 Tech Stack

* **Frontend**: React, Vite, Tailwind CSS v4, React Router DOM, Axios, Lucide React (Icons)
* **Backend**: Node.js, Express.js
* **Database**: MongoDB & Mongoose ODM
* **Security**: JWT Authentication, Bcrypt Password Encryption, strict CORS and Header protections.

## ⚙️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* Valid [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance string

### 1. Repository Setup

```bash
git clone https://github.com/your-username/ecommerce-project.git
cd ecommerce-project
```

### 2. Backend Initialization

```bash
cd backend
npm install
```

Configure your environment variables:
Create a `.env` file inside the `backend` directory (there is a template provided in `backend/.env.example`) and supply your secrets:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster0...
JWT_SECRET=your_super_secret_jwt_string_here
```

### 3. Frontend Initialization

Open a totally separate secondary terminal tab/window:
```bash
cd frontend
npm install
```

Ensure Vite knows how to map API requests by copying the example environment payload:
Create a `.env` file in the `frontend` folder from `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🗄️ Database Seeding (Crucial First Step)

Out of the box, the database requires items to function seamlessly. A highly powerful script has been provided to instantly wipe your active database and automatically inject 21 premium products across all parameters along with Admin configurations.

While inside the `backend` directory, run:
```bash
node src/seed/seeder.js
```
*(You should see a success message acknowledging total data population).*

## 🏃 Running the Application locally

**Start the Backend API Server:**
*(Ensure you are in the `backend` folder)*
```bash
npm run dev
```

**Start the Frontend React Interface:**
*(Ensure you are in the `frontend` folder)*
```bash
npm run dev
```

The application will natively compile and open a browser window operating aggressively at `http://localhost:5173`.

## 🔐 Default Access Credentials

Using the `seeder.js` script successfully activates the following accounts automatically:

**Administrator Gateway Access:**
- Email: `admin@example.com`
- Password: `password123`

**Standard Demo Customer Access:**
- Email: `customer@example.com`
- Password: `password123`

## 🛡️ Best Practices Noted
- `.gitignore` rigorously protects `node_modules/` and `.env` payloads from upstream leakage.
- JWT Interceptors cleanly dump stale sessions if standard backend token mismatches unexpectedly drop. Highly resilient client state preservation.
- Full responsive breakpoints mapping elegantly from 320px micro-mobiles up to 4K Ultrawides.
