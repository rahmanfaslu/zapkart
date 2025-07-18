import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Cart from './pages/Cart';
import React from 'react';
import Header from './components/Header';
import Whishlist from './pages/whishlist ';
import ProductPage from './pages/ProductPage';


 
function App() {
  return (
    
  <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/whishlist" element={<Whishlist />} />
        <Route path="/products" element={<ProductPage/>} />

      </Routes>
    </BrowserRouter>

    
  );
}

export default App;
