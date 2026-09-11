# Premium E-Commerce MERN Stack App

A complete, beautifully designed responsive mini E-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS. 

## Features
- **User Authentication**: Secure JWT-based login/registration.
- **Product Discovery**: Browse stunning product layouts with filtering and searching out of the box.
- **Cart Management**: Add, update quantities, remove items, and preview subtotals.
- **Checkout Simulation**: End-to-end checkout flow storing history in MongoDB without real payment processing logic.
- **Responsive Aesthetics**: Premium UI scaling beautifully from mobile 320px endpoints to 4K desktops using Tailwind CSS. 
- **Stock Validation**: Add-to-cart operations are checked heavily against backend stock metrics to prevent over-ordering.

## Technology Stack
- **Frontend**: Vite, React (Context API), React Router DOM, Tailwind CSS, Lucide React (Icons), Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, BcryptJS, express-validator.

## Folder Structure
```text
ecommerce-project/
├── backend/
│   ├── src/
│   │   ├── config/ (db connection)
│   │   ├── controllers/ (logic functions)
│   │   ├── middleware/ (auth & error handlers)
│   │   ├── models/ (Mongoose schemas)
│   │   ├── routes/ (Express routes)
│   │   └── seed/ (Mock data seeder)
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

## Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (Local or Atlas) - ensuring it runs on `mongodb://127.0.0.1:27017`

## Installation and Execution

### 1. Database Setup
Ensure MongoDB is running securely.

### 2. Backend Setup
```bash
cd backend
npm install
# Seed the database
npm run seed
# Start the backend server
npm run dev
```

### 3. Frontend Setup
Open a new terminal.
```bash
cd frontend
npm install
# Start the Vite React app
npm run dev
```

### Test Credentials
The database seeding scripts provide a test user automatically.
**Customer Login:**
- Email: `customer@example.com`
- Password: `password123`

## API Endpoints
Base URL: `/api`
- `POST /auth/register` : Register a user
- `POST /auth/login` : Login user
- `GET /products` : Get all products
- `GET /cart` : Protected. Get current user cart
- `POST /orders` : Protected. Create dummy checkout order

## Known Limitations
- The checkout step explicitly skips the standard Stripe integration, storing "Demo Card" instead.
- The Admin dashboard is omitted by default to optimize the customer flows.

## Future Improvements
- Integrate actual stripe payment gates.
- Create an Admin module specifically for tracking stock thresholds.
