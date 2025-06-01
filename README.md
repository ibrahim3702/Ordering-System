# Ordering System

A full-stack ordering system built with a React + Vite frontend and a Flask backend. The system allows users to browse items, manage inventory and offers, and place orders with discount logic. This project is suitable for small-scale e-commerce or as a learning resource for modern web development.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup Guidelines](#setup-guidelines)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Features & Approach](#features--approach)
- [Trade-offs & Design Decisions](#trade-offs--design-decisions)
- [API Overview](#api-overview)
- [License](#license)

---

## Project Structure

```
.
├── backend/
│   ├── app.py                # Flask app entry point
│   ├── models.py             # Data models (Item, Offer, Order, etc.)
│   ├── schemas.py            # Marshmallow schemas for validation/serialization
│   ├── routes/               # Flask blueprints for API endpoints
│   ├── services/             # Business logic for inventory, offers, ordering
│   ├── storage/              # (Optional) DB/data initialization
│   ├── utils/                # Logging and error handling utilities
│   └── logs/                 # Rotating log files
├── frontend/
│   ├── src/                  # React source code
│   │   ├── api/              # API service modules
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React context (e.g., Cart)
│   │   ├── pages/            # Page-level components (routes)
│   │   └── styles/           # CSS and variables
│   ├── public/               # Static assets
│   ├── index.html            # Main HTML file
│   ├── package.json          # Frontend dependencies and scripts
│   └── vite.config.js        # Vite configuration
├── README.md                 # Project documentation
└── .gitignore
```

---

## Tech Stack

### Backend

- **Python 3.10+**
- **Flask**: Web framework for REST API
- **Marshmallow**: Data validation and serialization
- **Flask-CORS**: Cross-origin resource sharing
- **In-memory storage**: Python dictionaries for demo purposes (no database)

### Frontend

- **React 19**: UI library
- **Vite**: Fast development/build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Headless UI & Heroicons**: Accessible UI primitives and icons
- **React Hot Toast**: Toast notifications

---

## Setup Guidelines

### Backend Setup

1. **Install dependencies**  
   Navigate to the `backend/` directory and install required Python packages:
   ```sh
   pip install flask marshmallow flask-cors
   ```

2. **Run the backend server**
   ```sh
   python app.py
   ```
   The backend will start on `http://localhost:5000`.

3. **Logs**  
   Logs are written to `backend/logs/ordering_system.log` (auto-created).

---

### Frontend Setup

1. **Install dependencies**  
   Navigate to the `frontend/` directory and run:
   ```sh
   npm install
   ```

2. **Start the development server**
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or as indicated in the terminal).

3. **Build for production**
   ```sh
   npm run build
   ```

---

## Features & Approach

### Features

- **Browse Items**: Users can view available items, see stock status, and add to cart.
- **Cart & Order Creation**: Users can adjust quantities, see discounts, and place orders.
- **Manage Inventory**: Admins can add, edit, or delete items.
- **Manage Offers**: Admins can create, edit, or delete discount offers, specifying applicable items and minimum quantities.
- **Order Confirmation**: Users receive confirmation with order ID after placing an order.
- **Responsive UI**: Built with Tailwind CSS and custom variables for light/dark themes.
- **Notifications**: Success/error toasts for user feedback.

### Approach

- **Backend**:  
  - Used Flask for simplicity and rapid prototyping.
  - All data is stored in-memory using Python dictionaries for demo purposes (no persistent DB).
  - Marshmallow schemas ensure input validation and serialization.
  - Business logic is separated into `services/` for maintainability.
  - Logging and error handling are centralized in `utils/`.

- **Frontend**:  
  - React with functional components and hooks for state management.
  - Context API is used for cart state.
  - API calls are abstracted in `src/api/`.
  - Tailwind CSS and custom CSS variables provide a modern, themeable UI.
  - Modular structure: components, pages, and context are separated for clarity.

---

## Trade-offs & Design Decisions

- **In-memory Storage**:  
  - Chosen for simplicity and ease of demonstration.  
  - **Trade-off**: All data resets on server restart; not suitable for production.

- **No Authentication**:  
  - The system is open for demo/admin actions without login.
  - **Trade-off**: Not secure for real-world use.

- **Single Backend/Frontend Repo**:  
  - Keeps the project easy to navigate for learning and demo purposes.
  - **Trade-off**: In production, you may want to separate concerns further.

- **API Design**:  
  - RESTful endpoints with clear separation for management (admin) and user actions.
  - **Trade-off**: No pagination or advanced filtering for simplicity.

- **UI/UX**:  
  - Focused on clarity and responsiveness, with minimal dependencies.
  - **Trade-off**: No advanced accessibility or internationalization.

---

## API Overview

- **GET /items/**: List all items
- **POST/PUT /items/management**: Add or update an item
- **DELETE /items/management/<id>**: Delete an item

- **GET /offers/**: List all offers
- **POST/PUT /offers/management**: Add or update an offer
- **DELETE /offers/management/<id>**: Delete an offer

- **GET /orders/**: List all orders
- **POST /orders/**: Place a new order
- **GET /orders/<id>**: Get order details

---

## License

This project is for educational/demo purposes.  
Feel free to use, modify, or extend as needed.

---