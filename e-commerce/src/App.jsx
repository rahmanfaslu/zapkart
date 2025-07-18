import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Cart from './pages/Cart';
import React from 'react';
import Header from './components/Header';
import Whishlist from './pages/whishlist ';
import ProductPage from './pages/ProductPage';
import Search from './pages/search'; 
import OrderPage from './pages/OrderPage'
import { useAuth } from './context/AuthContext';


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
        <Route path="/register" element={ <Register />} />
        <Route path="/cart" element={ <PrivateRoute> <Cart /></PrivateRoute>} />
        <Route path="/whishlist" element={ <PrivateRoute> <Whishlist /> </PrivateRoute>} />
        <Route path="/products" element={ <ProductPage/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/orderpage" element={ <PrivateRoute>  <OrderPage/> </PrivateRoute>} />


      </Routes>
    </BrowserRouter>

    
  );
}

export default App;
