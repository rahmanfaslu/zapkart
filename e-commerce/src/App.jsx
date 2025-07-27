import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import React from 'react';
import Header from './components/Header';
import Whishlist from './pages/whishlist ';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import { useAuth } from './context/AuthContext';
import Checkout from './pages/Checkout';
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import NotFound from './pages/NotFound';
import AdminRoutes from './admin/routes/AdminRoutes';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/whishlist" element={<PrivateRoute><Whishlist /></PrivateRoute>} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/order" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />

        {/* ✅ Mount admin dashboard and subroutes here */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

