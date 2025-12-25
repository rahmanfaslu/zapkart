import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart, FaHeart, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navLinkClass = "text-gray-700 hover:text-blue-600 cursor-pointer transition";
  const { wishlist = [], clearWishlist } = useWishlist() || {};
  const { cartItems = [], clearLocalCart } = useCart() || {};
  const { user, logout } = useAuth() || {};
  const [searchInput, setSearchInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
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

  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
      setSearchInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLogout = () => {
    clearLocalCart?.();
    clearWishlist?.();
    logout?.();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-700 cursor-pointer">Shingify.in</Link>

          {/* Navbar */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={navLinkClass}>Home</Link>
            <Link to="/products" className={navLinkClass}>Products</Link>
            <Link to="/order" className={navLinkClass}>Orders</Link>

            <Link to="/wishlist" className="relative text-2xl text-gray-700 hover:text-blue-500">
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

            {/* Auth Section */}
            {!user ? (
              <>
                <Link to="/login" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Login</Link>
                <Link to="/register" className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600">Register</Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="text-sm">Hi, {user?.email?.split("@")[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4 lg:hidden">
            <Link to="/wishlist" className="relative text-xl text-gray-700 hover:text-blue-500">
              <FaHeart />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-xl text-gray-700 hover:text-blue-500">
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button onClick={toggleMobileMenu} className="text-2xl text-gray-700 hover:text-blue-600">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-5 py-0 border-t border-gray-200">
            <nav className="flex flex-col space-y-0">
              <Link to="/" onClick={closeMobileMenu} className={`${navLinkClass} py-2`}>Home</Link>
              <Link to="/products" onClick={closeMobileMenu} className={`${navLinkClass} py-2`}>Products</Link>
              <Link to="/order" onClick={closeMobileMenu} className={`${navLinkClass} py-2`}>Orders</Link>

              {!user ? (
                <div className="flex flex-col space-y-3">
                  <Link to="/login" onClick={closeMobileMenu} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center">Login</Link>
                  <Link to="/register" onClick={closeMobileMenu} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center">Register</Link>
                </div>
              ) : (
                <div className="relative flex flex-col space-y-3 mt-2" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
                  >
                    <FaUserCircle className="text-xl" />
                    <span className="text-sm">Hi, {user?.email?.split("@")[0]}</span>
                  </button>

                  {dropdownOpen && (
                    <div className="mt-2 w-full bg-white border border-gray-200 rounded shadow-md">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          closeMobileMenu();
                        }}
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
