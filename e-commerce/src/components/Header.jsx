import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navLinkClass = "text-gray-700 hover:text-blue-600 cursor-pointer transition";
  const { wishlist } = useWishlist();
  const { cartItems } = useCart();
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Search on icon click or enter key
  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
      setSearchInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-700 cursor-pointer">
          ZapKart
        </Link>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search for gadgets..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <IoMdSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Navigation + Icons */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className={navLinkClass}>Home</Link>
          <Link to="/products" className={navLinkClass}>Products</Link>
          <Link to="/orders" className={navLinkClass}>Orders</Link>
          <Link to="/whishlist" className="relative text-2xl text-gray-700 hover:text-blue-500">
            <FaHeart />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-2xl text-gray-700 hover:text-blue-500">
            <FaShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
            
          
        {!user ? (
          <>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-600">
              Hi, {user.email.split("@")[0]}
            </span>
            <button
  onClick={() => {
    logout();
    navigate('/login');
  }}
  className="ml-2 bg-blue-500 text-white px-4 py-1 rounded-2xl hover:bg-blu-600"
>
  Logout
</button>
          </>
        )}
        </nav>
      </div>
    </header>
  );
}
