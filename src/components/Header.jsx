import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart, FaHeart, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { wishlist = [], clearWishlist } = useWishlist() || {};
  const { cartItems = [], clearLocalCart } = useCart() || {};
  const { user, logout } = useAuth() || {};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearLocalCart?.();
    clearWishlist?.();
    logout?.();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const navLink = (path) =>
    `relative pb-1 transition ${
      location.pathname === path
        ? "text-blue-600 font-medium after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-blue-600"
        : "text-gray-700 hover:text-blue-600 hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-0.5 hover:after:w-full hover:after:bg-blue-600/50"
    }`;

  const iconBox = "relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-700 tracking-tight">
            Shingify<span className="text-gray-400 text-sm">.in</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={navLink("/")}>Home</Link>
            <Link to="/products" className={navLink("/products")}>Products</Link>
            <Link to="/order" className={navLink("/order")}>Orders</Link>

            <Link to="/wishlist" className={iconBox}>
              <FaHeart className="text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className={iconBox}>
              <FaShoppingCart className="text-gray-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {!user ? (
              <>
                <Link to="/login" className="px-4 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition">Login</Link>
                <Link to="/register" className="px-4 py-1.5 rounded bg-gray-600 text-white hover:bg-gray-700 transition">Register</Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <FaUserCircle className="text-xl text-gray-700" />
                  <span className="text-sm text-gray-700">
                    {user?.email?.split("@")[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Icons */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/wishlist" className={iconBox}>
              <FaHeart />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className={iconBox}>
              <FaShoppingCart />
              {cartItems.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">{cartItems.length}</span>}
            </Link>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={iconBox}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 border-t pt-4 space-y-3">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700">Home</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700">Products</Link>
            <Link to="/order" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700">Orders</Link>

            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center bg-blue-500 text-white py-2 rounded">Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block text-center bg-gray-600 text-white py-2 rounded">Register</Link>
              </>
            ) : (
              <>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block">Profile</Link>
                <button onClick={handleLogout} className="block text-left text-red-600">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
