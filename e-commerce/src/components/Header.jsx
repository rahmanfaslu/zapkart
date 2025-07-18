import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from '../context/CartContext';
// import {cartItems} from '../context/CartContext'; 

export default function Header() {
  const navLinkClass = "text-gray-700 hover:text-blue-600 cursor-pointer transition";
  const { wishlist } = useWishlist();
  const { cartItems } = useCart();


  return (
    <header className="bg-white shadow-md sticky top-0 z-50 ">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" smooth duration={500} className="text-2xl font-bold text-blue-700 cursor-pointer">
          ZapKart
        </Link>

        <div className="relative group hidden sm:block w-full max-w-xs">
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-white-300 text-white-300 dark:text-gray-400"
      />
      <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-300 dark:text-gray-400" />
    </div>

        <nav className="flex items-center justify-center space-x-6 py-2 ">
  <Link to="/" className={navLinkClass}>Home</Link>
  <Link to="/products" className={navLinkClass}>Products</Link>
  
 <Link
        to="/whishlist"
        className="relative flex items-center space-x-1 text-2xl text-gray-700 hover:text-blue-500"
      >
        <FaHeart />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {wishlist.length}
          </span>
        )}
      </Link>

  <Link
        to="/cart"
        className="relative flex items-center space-x-1 text-2xl text-gray-700 hover:text-blue-500"
      >
        <FaShoppingCart />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {cartItems.length}
          </span>
        )}
      </Link>


  <Link to="/login" className={navLinkClass}>Login</Link>
  <Link to="/register" className={navLinkClass}>Register</Link>
</nav>

      </div>
    </header>
  );
}
