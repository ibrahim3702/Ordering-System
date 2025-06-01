import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BrowseItem from './pages/BrowseItem';
import CreateOrder from './pages/CreateOrder';
import ManageInventory from './pages/ManageInventory';
import ManageOffers from './pages/ManageOffers';
import NavBar from './components/NavBar';
import './styles/main.css';
import OrderConfirmation from './pages/OrderConfirmation';
import { Toaster } from 'react-hot-toast';
const App = () => {
  return (
    <CartProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        {/* <nav>
          <Link to="/">Browse Items</Link>
          <Link to="/order">Your Order</Link>
          <Link to="/manage-items">Manage Inventory</Link>
          <Link to="/manage-offers">Manage Offers</Link>
        </nav> */}
        <NavBar />

        <Routes>
          <Route path="/" element={<BrowseItem />} />
          <Route path="/order" element={<CreateOrder />} />
          <Route path="/manage-items" element={<ManageInventory />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/manage-offers" element={<ManageOffers />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;