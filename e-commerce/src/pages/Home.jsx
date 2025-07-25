import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaHeart } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock context functions - replace with actual context imports
  const wishlist = [];
  const addToWishlist = (item) => console.log('Added to wishlist:', item);
  const addToCart = (item) => console.log('Added to cart:', item);
  const navigate = useNavigate();

  const handleNavigateToAudio = () => {
    navigate('/products?category=Audio');
    // or navigate('/products/audio') depending on your route structure
  };
  const products = [


    {
      id: 1,
      title: "Beat Solo 2",
      subtitle: "Wireless Headset",
      description: "The Beats Solo 4 Cloud Pink blend premium design, immersive spatial audio, and all-day comfort in a lightweight package",
      bgColor: "bg-blue-100",
      titleColor: "text-gray-800",
      subtitleColor: "text-blue-500",
      buttonColor: "bg-blue-500 hover:bg-blue-700"
    },
    {
      id: 2,
      title: "AirPods Pro",
      subtitle: "Premium Earbuds",
      description: "Experience next-level sound with Active Noise Cancellation, Transparency mode, and Spatial Audio technology",
      bgColor: "bg-purple-100",
      titleColor: "text-gray-800",
      subtitleColor: "text-purple-500",
      buttonColor: "bg-purple-500 hover:bg-purple-700"
    },
    {
      id: 3,
      title: "Studio Max",
      subtitle: "Over-Ear Headphones",
      description: "Professional-grade studio headphones with exceptional clarity, deep bass, and premium comfort for extended use",
      bgColor: "bg-green-100",
      titleColor: "text-gray-800",
      subtitleColor: "text-green-500",
      buttonColor: "bg-green-500 hover:bg-green-700"
    },
    {
      id: 4,
      title: "PowerBeats Pro",
      subtitle: "Sports Wireless",
      description: "Designed for athletes with secure-fit ear hooks, sweat resistance, and powerful sound that motivates your workout",
      bgColor: "bg-red-100",
      titleColor: "text-gray-800",
      subtitleColor: "text-red-500",
      buttonColor: "bg-red-500 hover:bg-red-700"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">

      {/* Home Section with Carousel */}
      <section id="home" className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* Slides Container */}
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {products.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <div className={`${product.bgColor} h-125 rounded-2xl p-6 relative overflow-hidden`}>
                    {/* Content */}
                    <div className="relative z-10">
                      <h1 className={`text-6xl md:text-8xl ${product.titleColor} pl-20 pt-20 font-bold`}>
                        {product.title}
                      </h1>
                      <h1 className={`text-3xl md:text-5xl ${product.subtitleColor} -mb-6 pl-19`}>
                        {product.subtitle}
                      </h1>
                      <h1 className={`text-sm md:text-base ${product.titleColor} leading-relaxed pt-8 pl-20 max-w-2xl`}>
                        {product.description}
                      </h1>
                      <button 
                        type="submit" 
                        className={`px-6 py-2 ${product.buttonColor} ml-20 mt-4 text-white rounded-lg transition duration-300 font-semibold`}
                      >
                        Shop Now
                      </button>
                    </div>
                    
                    {/* Decorative Background Element */}
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-64 h-64 opacity-20">
                      <div className="w-full h-full rounded-full border-8 border-current animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-20"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-20"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="products" className="py-8 px-4 bg-amber-100">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Categories</h2>

          {/* Top Row */}
          <div className="flex space-x-4 p-4">
            {/* Card 1 */}
            <div className="w-1/3 h-50 bg-gradient-to-br from-gray-800 to-black rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer">
      <p className='text-white pl-10 pt-8 z-10 relative'>Enjoy</p>
      <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>With</h2>
      <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>EARPHONE</h1>
      <button 
        type="button" 
        onClick={handleNavigateToAudio}
        className="w-20 h-10 ml-[35px] bg-red-600 text-white py-2 rounded-full hover:bg-gray-700 transition duration-300 font-semibold z-10 relative"
      >
        Click
      </button>
      <img src="/earphone.png" alt="Earphone" className="absolute bottom-0 right-10 w-50 opacity-90" />
    </div>


            {/* Card 2 */}
            <div className="w-1/3 h-50 bg-yellow-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer">
              <p className='text-white pl-10 pt-8 z-10 relative'>Smart</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>Wear</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>WATCH</h1>
              <button type="submit" className="w-20 h-10 ml-[35px] bg-white text-yellow-500 py-2 rounded-full hover:bg-gray-800 transition duration-300 font-semibold z-10 relative" 
              onClick={handleNavigateToAudio}
              >Click</button>
              <img src="/watch.png" alt="Watch" className="absolute bottom-5 right-2 w-50 opacity-90" />
            </div>

            {/* Card 3 */}
            <div className="w-1/2 h-50 bg-gradient-to-br from-red-600 to-red-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer">
              <p className='text-white pl-10 pt-8 z-10 relative'>Power</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>With</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>LAPTOP</h1>
              <button type="submit" className="w-20 h-10 ml-[35px] bg-white text-red-600 py-2 rounded-full hover:bg-red-300 transition duration-300 font-semibold z-10 relative" 
              onClick={handleNavigateToAudio}
              >Click</button>
              <img src="/macbook.png" alt="Laptop" className="absolute bottom-0 right-3 w-50 opacity-90" />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex space-x-4 p-4">
            {/* Card 4 */}
            <div className="w-1/2 h-50 bg-gray-300 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer">
              <p className='text-black pl-10 pt-8 z-10 relative'>Best</p>
              <h2 className='text-black pl-10 text-2xl font-bold z-10 relative'>Gaming</h2>
              <h1 className='text-black text-4xl pl-[38px] font-bold z-10 relative'>CONSOLE</h1>
              <button type="submit" className="w-20 h-10 ml-[35px] bg-red-600 text-white py-2 rounded-full hover:bg-gray-400 transition duration-300 font-semibold z-10 relative" 
              onClick={handleNavigateToAudio}
              >Click</button>
              <img src="/gaming.png" alt="Console" className="absolute bottom-0 right-3 w-50 opacity-90" />
            </div>

            {/* Card 5 */}
            <div className="w-1/3 h-50 bg-blue-500 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer">
              <p className='text-white pl-10 pt-8 z-10 relative'>Play</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>Game</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>OCULUS</h1>
              <button type="submit" className="w-20 h-10 ml-[35px] bg-white text-blue-500 py-2 rounded-full hover:bg-blue-300 transition duration-300 font-semibold z-10 relative" 
              onClick={handleNavigateToAudio}
              >Click</button>
              <img src="/vr.png" alt="Oculus" className="absolute bottom-0 right-3 w-50 opacity-90" />
            </div>

            {/* Card 6 */}
            <div className="w-1/3 h-50 bg-gradient-to-br from-green-600 to-green-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer">
              <p className='text-white pl-10 pt-8 z-10 relative'>New</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>Smart</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>SPEAKER</h1>
              <button type="submit" className="w-20 h-10 ml-[35px] bg-white text-green-600 py-2 rounded-full hover:bg-green-300 transition duration-300 font-semibold z-10 relative"
              onClick={handleNavigateToAudio}
              >Click</button>
              <img src="/speaker.png" alt="Speaker" className="absolute bottom-0 right-3 w-50 opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            {/* Free Shipping */}
            <div className="flex flex-col items-center p-4">
              <div className="text-6xl mb-2"><LiaShippingFastSolid className='text-6xl' /></div>
              <h3 className="text-lg font-bold">Free Shipping</h3>
              <p className="text-sm text-gray-500">On all orders above ₹499</p>
            </div>

            {/* Money Guarantee */}
            <div className="flex flex-col items-center p-4">
              <div className="text-6xl mb-2"><HiOutlineBadgeCheck className='text-6xl' /></div>
              <h3 className="text-lg font-bold">Money Guarantee</h3>
              <p className="text-sm text-gray-500">07-day money-back guarantee</p>
            </div>

            {/* 24/7 Support */}
            <div className="flex flex-col items-center p-4">
              <div className="text-6xl mb-2"><TfiHeadphoneAlt className='text-6xl' /></div>
              <h3 className="text-lg font-bold">24/7 Support</h3>
              <p className="text-sm text-gray-500">Technical support 24*7</p>
            </div>

            {/* Secure Payment */}
            <div className="flex flex-col items-center p-4">
              <div className="text-6xl mb-2"><IoWalletOutline className='text-6xl' /></div>
              <h3 className="text-lg font-bold">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure & encrypted</p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-15 bg-gray-100 px-4">
        <h1 className="text-center text-3xl font-bold mb-10 text-blue-700">
          Featured Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Product 5 */}
          <div className="max-w-[248px] rounded-xl bg-white shadow-lg p-5 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.03] duration-300">
            <img src="/gaming.png" alt="Gaming Controller" className="mb-4 object-contain w-32 scale-100 transition-transform duration-300" />
            <p className="text-sm text-gray-500 mb-1">Gaming</p>
            <h2 className="text-base font-semibold text-gray-800 mb-1">Sony PlayStation 4</h2>
            <p className="text-black font-bold text-lg mb-4">₹19,999</p>
            <div className="flex justify-center items-center gap-3 mt-auto">
              <button
                className={`text-xl ${
                  wishlist.find((w) => w.id === 101)
                    ? "text-red-600"
                    : "text-gray-400 hover:text-red-600"
                }`}
                onClick={() => {
                  const item = {
                    id: 101,
                    title: "Sony PlayStation 4",
                    price: 19999,
                    image: "/gaming.png",
                    category: "Gaming",
                  };
                  const isInWishlist = wishlist.find((w) => w.id === item.id);
                  addToWishlist(item);
                  alert(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
                }}
              >
               <FaHeart />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() =>
                  addToCart({
                    id: 101,
                    title: "Sony PlayStation 4",
                    price: 19999,
                    image: "/gaming.png",
                    category: "Gaming",
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product 6 */}
          <div className="max-w-[248px] rounded-xl bg-white shadow-lg p-5 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.03] duration-300">
            <img src="/p-6.png" alt="iPhone 16 Pro" className="mb-4 object-contain w-32 scale-130 transition-transform duration-300" />
            <p className="text-sm text-gray-500 mb-1">Phones</p>
            <h2 className="text-base font-semibold text-gray-800 mb-1">I Phone 16 pro</h2>
            <p className="text-black font-bold text-lg mb-4">₹1,11,099</p>
            <div className="flex justify-center items-center gap-3 mt-auto">
              <button
                className={`text-xl ${
                  wishlist.find((w) => w.id === 102)
                    ? "text-red-600"
                    : "text-gray-400 hover:text-red-600"
                }`}
                onClick={() => {
                  const item = {
                    id: 102,
                    title: "I Phone 16 pro",
                    price: 111099,
                    image: "/p-6.png",
                    category: "Phones",
                  };
                  const isInWishlist = wishlist.find((w) => w.id === item.id);
                  addToWishlist(item);
                  alert(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
                }}
              >
              <FaHeart />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() =>
                  addToCart({
                    id: 102,
                    title: "I Phone 16 pro",
                    price: 111099,
                    image: "/p-6.png",
                    category: "Phones",
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product 7 */}
          <div className="max-w-[248px] rounded-xl bg-white shadow-lg p-5 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.03] duration-300">
            <img src="/p-4.png" alt="Smart Watch" className="mb-4 object-contain w-32 scale-160 transition-transform duration-300 pt-4" />
            <p className="text-sm text-gray-500 mb-1">Laptops</p>
            <h2 className="text-base font-semibold text-gray-800 mb-1">MacBook Pro M2</h2>
            <p className="text-black font-bold text-lg mb-4">₹1,999</p>
            <div className="flex justify-center items-center gap-3 mt-auto">
              <button
                className={`text-xl ${
                  wishlist.find((w) => w.id === 103)
                    ? "text-red-600"
                    : "text-gray-400 hover:text-red-600"
                }`}
                onClick={() => {
                  const item = {
                    id: 103,
                    title: "MacBook Pro M2",
                    price: 1999,
                    image: "/p-4.png",
                    category: "Laptops",
                  };
                  const isInWishlist = wishlist.find((w) => w.id === item.id);
                  addToWishlist(item);
                  alert(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
                }}
              >
              <FaHeart />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() =>
                  addToCart({
                    id: 103,
                    title: "MacBook Pro M2",
                    price: 1999,
                    image: "/p-4.png",
                    category: "Laptops",
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product 8 */}
          <div className="max-w-[248px] rounded-xl bg-white shadow-lg p-5 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.03] duration-300">
            <img src="/p-8.png" alt="Apple Watch 2" className="mb-4 pt-4 object-contain w-32 scale-160 transition-transform duration-300" />
            <p className="text-sm text-gray-500 mb-1">Watch</p>
            <h2 className="text-base font-semibold text-gray-800 mb-1">Apple Watch 2</h2>
            <p className="text-black font-bold text-lg mb-4">₹1,799</p>
            <div className="flex justify-center items-center gap-3 mt-auto">
              <button
                className={`text-xl ${
                  wishlist.find((w) => w.id === 104)
                    ? "text-red-600"
                    : "text-gray-400 hover:text-red-600"
                }`}
                onClick={() => {
                  const item = {
                    id: 104,
                    title: "Apple Watch 2",
                    price: 1799,
                    image: "/p-8.png",
                    category: "Watch",
                  };
                  const isInWishlist = wishlist.find((w) => w.id === item.id);
                  addToWishlist(item);
                  alert(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
                }}
              >
              <FaHeart />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() =>
                  addToCart({
                    id: 104,
                    title: "Apple Watch 2",
                    price: 1799,
                    image: "/p-8.png",
                    category: "Watch",
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section>
        <footer className="bg-gray-900 text-gray-300 pt-10 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-gray-700">
            
            {/* Brand */}
            <div>
              <img src="/z.png" alt="Shingify.in Logo" className="w-12 h-12 mb-2" />
              <h2 className="text-2xl font-bold text-white mb-3">Shingify.in</h2>
              <p className="text-sm text-gray-400">Your one-stop shop for the latest electronic gadgets.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/products" className="hover:text-white">Products</a></li>
                <li><a href="/cart" className="hover:text-white">Cart</a></li>
                <li><a href="/login" className="hover:text-white">Login</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Return Policy</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
              <p className="text-sm mb-3">support@Shingify.in.com</p>
              <div className="flex space-x-4 text-xl">
                <a href="#" className="hover:text-white"><FaFacebook /></a>
                <a href="#" className="hover:text-white">🐦</a>
                <a href="#" className="hover:text-white">📷</a>
                <a href="#" className="hover:text-white">💼</a>
              </div>
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="text-center text-sm py-4 text-gray-500">
            © {new Date().getFullYear()} Shingify.in. All rights reserved.
          </div>
        </footer>
      </section>  
    </div>
  );
}