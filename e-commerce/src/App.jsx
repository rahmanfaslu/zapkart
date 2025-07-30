import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import PolicyPage from './pages/PolicyPage';
import Profile from "./pages/Profile";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Header />}
      {children}
      {!isAdminPath && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductPage />} />

          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/whishlist" element={<PrivateRoute><Whishlist /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />

          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/policies" element={<PolicyPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
