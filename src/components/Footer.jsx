// src/components/Footer.jsx
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-gray-700">
        <div>
          <img src="/shingify.png" alt="Shingify.in Logo" className="w-12 h-12 mb-2" />
          <h2 className="text-2xl font-bold text-white mb-3">Shingify.in</h2>
          <p className="text-sm text-gray-400">
            Your one-stop shop for the latest electronic gadgets.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li><a href="/cart" className="hover:text-white">Cart</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/policies" className="hover:text-white">Contact Us</a></li>
            <li><a href="/policies" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/policies" className="hover:text-white">Return Policy</a></li>
            <li><a href="/policies" className="hover:text-white">FAQs</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
          <p className="text-sm mb-3">support@Shingify.in.com</p>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-white"><FaFacebook /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm py-4 text-gray-500">
        © {new Date().getFullYear()} Shingify.in. All rights reserved.
      </div>
    </footer>
  );
}
