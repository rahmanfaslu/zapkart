import React, { useState, useEffect, Fragment } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaHeart } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import toast from 'react-hot-toast';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const { cartItems, addToCart } = useCart();
  const { wishlist, addToWishlist } = useWishlist();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [randomText, setRandomText] = useState("");
 
  const navigate = useNavigate();

  const marketingTexts = [
    "Best choice for everyday use!",
    "Loved by thousands of customers.",
    "Limited stock. Hurry up!",
    "Top-rated product in its category.",
    "You won't regret this purchase!"
  ];

  const products = [
    {
      id: 1,
      title: "Beat Solo 2",
      subtitle: "Wireless Headset",
      description: "The Beats Solo 4 Cloud Pink blend premium design, immersive spatial audio, and all-day comfort in a lightweight package",
      bgColor: "bg-blue-100",
      titleColor: "text-gray-800",
      subtitleColor: "text-blue-500", 
      buttonColor: "bg-blue-500 hover:bg-blue-700",
      image: "beat solo.png",
      imageClasses: "scale-200"
    },
    {
      id: 2,
      title: "AirPods Pro",
      subtitle: "Premium Earbuds",
      description: "Experience next-level sound with Active Noise Cancellation, Transparency mode, and Spatial Audio technology",
      bgColor: "bg-purple-100",
      titleColor: "text-gray-800",
      subtitleColor: "text-purple-500",
      buttonColor: "bg-purple-500 hover:bg-purple-700",
      image: "airpodes.png"
    },
    {
      id: 3,
      title: "Mac Studio",
      subtitle: "Powerful Computer",
      description: "A compact powerhouse built for creators, with lightning-fast M-series performance and pro-level features",
      bgColor: "bg-green-100",
      titleColor: "text-gray-800",
      subtitleColor: "text-green-500",
      buttonColor: "bg-green-500 hover:bg-green-700",
      image: "machub.png"
    },
    {
      id: 4,
      title: "MacBook Pro",
      subtitle: "Sports Wireless",
      description: "Designed for athletes with secure-fit ear hooks, sweat resistance, and powerful sound that motivates your workout",
      bgColor: "bg-red-100",
      titleColor: "text-gray-800",
      subtitleColor: "text-red-500",
      buttonColor: "bg-red-500 hover:bg-red-700",
      image: "macbook pro.png"
    }
  ];

  // Fetch  
  useEffect(() => {
    axios.get("http://localhost:3001/Products")
      .then((res) => setAllProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Auto-slide  
  useEffect(() => {
    if (!isAutoSliding) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [isAutoSliding, products.length]);

  const getRandomText = () => {
    return marketingTexts[Math.floor(Math.random() * marketingTexts.length)];
  };

  const handleMouseEnter = () => setIsAutoSliding(false);
  const handleMouseLeave = () => setIsAutoSliding(true);

  const handleNavigateToCategory = (category) => {
    navigate("/products", { state: { category } });
  };

  const handleShopNow = (productTitle) => {
    let foundProduct = null;
    
    if (productTitle === "Beat Solo 2") {
      foundProduct = allProducts.find(p => p.title === "Beat Solo 2");
    } else if (productTitle === "AirPods Pro") {
      foundProduct = allProducts.find(p => p.title === "Airpdes Pro" || p.title === "AirPods Pro");
    } else if (productTitle === "Mac Studio") {
      foundProduct = allProducts.find(p => p.title === "Apple Mac Studio");
    } else if (productTitle === "MacBook Pro") {
      foundProduct = allProducts.find(p => p.title === "MacBook Pro M2");
    }

    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setModalQuantity(1);
      setRandomText(getRandomText());
      setIsModalOpen(true);
    } else {
      toast.success("Product not found in database");
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 3000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 3000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      
      <section id="home" className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div 
            className="relative overflow-hidden rounded-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
           
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {products.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <div className={`${product.bgColor} h-125 rounded-2xl p-6 relative overflow-hidden`}>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1">
                        <h1 className={`text-6xl md:text-7xl ${product.titleColor} pl-19 pt-20 font-bold`}>
                          {product.title}
                        </h1>
                        <h1 className={`text-3xl md:text-5xl ${product.subtitleColor} -mb-6 pl-19`}>
                          {product.subtitle}
                        </h1>
                        <h1 className={`text-sm md:text-base ${product.titleColor} leading-relaxed pt-8 pl-20 max-w-2xl`}>
                          {product.description}
                        </h1>
                        <button 
                          type="button" 
                          onClick={() => handleShopNow(product.title)}
                          className={`px-6 py-2 ${product.buttonColor} ml-20 mt-4 text-white rounded-lg transition duration-300 font-semibold`}
                        >
                          Shop Now
                        </button>
                      </div>
                      
                      <div className="flex-1 flex justify-center items-center">
                        <img 
                          src={`/${product.image}`} 
                          alt={product.title}
                          className={`w-80 h-80 object-contain drop-shadow-2xl hover:scale-103 transition-transform duration-300 ${
                            product.id === 1 ? 'w-100 h-80 absolute top-[40px]' :
                            product.id === 2 ? 'absolute top-[40px]' :
                            product.id === 3 ? 'mr-10 pt-10 w-90 h-80' :
                            product.id === 4 ? 'absolute top-[40px] w-120 h-80' : ''
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-64 h-64 mr-30 opacity-20">
                      <div className="w-full h-full rounded-full border-current"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

         
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

          
            <div className="absolute top-4 right-4 z-20">
              <div 
                className={`w-3 h-3 rounded-full ${isAutoSliding ? 'bg-green-500' : 'bg-red-500'} opacity-70`} 
                title={isAutoSliding ? 'Auto-slide active' : 'Auto-slide paused'}
              ></div>
            </div>
          </div>

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

          <div className="flex space-x-4 p-4">
            <div 
              className="w-1/3 h-50 bg-gradient-to-br from-gray-800 to-black rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Headphones')}
            >
              <p className='text-white pl-10 pt-8 z-10 relative'>Enjoy</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>With</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>EARPHONE</h1>
              <button 
                type="button" 
                className="w-20 h-10 ml-[35px] bg-red-600 text-white py-2 rounded-full hover:bg-gray-700 transition duration-300 font-semibold z-10 relative"
              >
                Click
              </button>
              <img src="/earphone.png" alt="Earphone" className="absolute bottom-0 right-10 w-50 opacity-90" />
            </div>

            <div 
              className="w-1/3 h-50 bg-yellow-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Watches')}
            >
              <p className='text-white pl-10 pt-8 z-10 relative'>Smart</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>Wear</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>WATCH</h1>
              <button type="button" className="w-20 h-10 ml-[35px] bg-white text-yellow-500 py-2 rounded-full hover:bg-gray-800 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img src="/watch.png" alt="Watch" className="absolute bottom-5 right-2 w-50 opacity-90" />
            </div>

            <div 
              className="w-1/2 h-50 bg-gradient-to-br from-red-600 to-red-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Laptops')}
            >
              <p className='text-white pl-10 pt-8 z-10 relative'>Power</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>With</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>LAPTOP</h1>
              <button type="button" className="w-20 h-10 ml-[35px] bg-white text-red-600 py-2 rounded-full hover:bg-red-300 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img src="/macbook.png" alt="Laptop" className="absolute bottom-0 right-3 w-50 opacity-90" />
            </div>
          </div>

          <div className="flex space-x-4 p-4">
             
            <div 
              className="w-1/2 h-50 bg-gray-300 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Gaming')}
            >
              <p className='text-black pl-10 pt-8 z-10 relative'>Best</p>
              <h2 className='text-black pl-10 text-2xl font-bold z-10 relative'>Gaming</h2>
              <h1 className='text-black text-4xl pl-[38px] font-bold z-10 relative'>CONSOLE</h1>
              <button type="button" className="w-20 h-10 ml-[35px] bg-red-600 text-white py-2 rounded-full hover:bg-gray-400 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img src="/gaming.png" alt="Console" className="absolute bottom-0 right-3 w-50 opacity-90" />
            </div>

            <div 
              className="w-1/3 h-50 bg-blue-500 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('AR')}
            >
              <p className='text-white pl-10 pt-8 z-10 relative'>Play</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>Game</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>OCULUS</h1>
              <button type="button" className="w-20 h-10 ml-[35px] bg-white text-blue-500 py-2 rounded-full hover:bg-blue-300 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img src="/vr.png" alt="Oculus" className="absolute bottom-0 right-3 w-50 opacity-90" />
            </div>

            <div 
              className="w-1/3 h-50 bg-gradient-to-br from-green-600 to-green-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Speaker')}
            >
              <p className='text-white pl-10 pt-8 z-10 relative'>New</p>
              <h2 className='text-white pl-10 text-2xl font-bold z-10 relative'>Smart</h2>
              <h1 className='text-white text-4xl pl-[38px] font-bold z-10 relative'>SPEAKER</h1>
              <button type="button" className="w-20 h-10 ml-[35px] bg-white text-green-600 py-2 rounded-full hover:bg-green-300 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img src="/speaker.png" alt="Speaker" className="absolute bottom-0 right-3 w-50 opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-4">
              <div className="text-6xl mb-2"><LiaShippingFastSolid className='text-6xl' /></div>
              <h3 className="text-lg font-bold">Free Shipping</h3>
              <p className="text-sm text-gray-500">On all orders above ₹499</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="text-6xl mb-2"><HiOutlineBadgeCheck className='text-6xl' /></div>
              <h3 className="text-lg font-bold">Money Guarantee</h3>
              <p className="text-sm text-gray-500">07-day money-back guarantee</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="text-6xl mb-2"><TfiHeadphoneAlt className='text-6xl' /></div>
              <h3 className="text-lg font-bold">24/7 Support</h3>
              <p className="text-sm text-gray-500">Technical support 24*7</p>
            </div>
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
          {/* Product 1 */}
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
                onClick={async () => {
                  const item = {
                    id: 101,
                    title: "Sony PlayStation 4",
                    price: 19999,
                    image: "/gaming.png",
                    category: "Gaming",
                  };
                  
                  const isInWishlist = wishlist.find((w) => w.id === item.id);
                  
                  try {
                    await addToWishlist(item);
                    toast.success(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
                  } catch (error) {
                    console.error("Error updating wishlist:", error);
                    toast.error("Failed to update wishlist. Please try again.");
                  }
                }}
              >
                <FaHeart />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() => {
                  addToCart({
                    id: 101,
                    title: "Sony PlayStation 4",
                    price: 19999,
                    image: "/gaming.png",
                    category: "Gaming",
                  });
                  toast.success("Item added to cart!");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product 2 */}
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
                onClick={async () => {
                  const item = {
                    id: 102,
                    title: "I Phone 16 pro",
                    price: 111099,
                    image: "/p-6.png",
                    category: "Phones",
                  };
                  
                  const isInWishlist = wishlist.find((w) => w.id === item.id);
                  
                  try {
                    await addToWishlist(item);
                    toast.success(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
                  } catch (error) {
                    console.error("Error updating wishlist:", error);
                    toast.error("Failed to update wishlist");
                  }
                }}
              >
                <FaHeart />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() => {
                  addToCart({
                    id: 102,
                    title: "I Phone 16 pro",
                    price: 111099,
                    image: "/p-6.png",
                    category: "Phones",
                  });
                   toast.success("Item added to cart!");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product 3 */}
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
                onClick={async () => {
                  const item = {
                    id: 103,
                    title: "MacBook Pro M2",
                    price: 1999,
                    image: "/p-4.png",
                    category: "Laptops",
                  };
                  
                  const isInWishlist = wishlist.find((w) => w.id === item.id);
                  
                  try {
                    await addToWishlist(item);
                    toast.success(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
                  } catch (error) {
                    console.error("Error updating wishlist:", error);
                    toast.error("Failed to update wishlist. Please try again.");
                  }
                }}
              >
                <FaHeart />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() => {
                  addToCart({
                    id: 103,
                    title: "MacBook Pro M2",
                    price: 1999,
                    image: "/p-4.png",
                    category: "Laptops",
                  });
                   toast.success("Item added to cart!");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product 4 */}
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
                onClick={async () => {
                  const item = {
                    id: 104,
                    title: "Apple Watch 2",
                    price: 1799,
                    image: "/p-8.png",
                    category: "Watch",
                  };
                  
                  const isInWishlist = wishlist.find((w) => w.id === item.id);
                  
                  try {
                    await addToWishlist(item);
                    toast.success(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
                  } catch (error) {
                    console.error("Error updating wishlist:", error);
                    toast.error("Failed to update wishlist. Please try again.");
                  }
                }}
              >
                <FaHeart />
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() => {
                  addToCart({
                    id: 104,
                    title: "Apple Watch 2",
                    price: 1799,
                    image: "/p-8.png",
                    category: "Watch",
                  });
                  toast.success("Item added to cart!");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedProduct && (
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        className="w-full md:w-1/2 object-contain"
                      />

                      <div className="flex-1 space-y-3 mt-2">
                        <Dialog.Title as="h2" className="text-3xl font-bold text-gray-800">
                          {selectedProduct.title}
                        </Dialog.Title>

                        <p className="text-sm text-gray-500 italic">
                          {randomText}
                        </p>

                        <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                        <p className="text-black-700 font-bold text-lg">
                          ₹{selectedProduct.price}
                        </p>
                        <p className="text-sm text-gray-700">
                          Category: {selectedProduct.category}
                        </p>

                        <button
                          className={`text-xl ${
                            wishlist.find((w) => w.id === selectedProduct.id)
                              ? "text-red-600"
                              : "text-gray-400 hover:text-red-600"
                          }`}
                          onClick={() => {
                            const isInWishlist = wishlist.find((w) => w.id === selectedProduct.id);
                            addToWishlist(selectedProduct);
                            toast.success(
                              isInWishlist
                                ? "Removed from Wishlist"
                                : "Added to Wishlist"
                            );
                          }}
                        >
                          <FaHeart />
                        </button>

                        <div className="flex items-center gap-2">
                          <label>Quantity:</label>
                          <input 
                            type="number"
                            min="1"
                            value={modalQuantity}
                            onChange={(e) =>
                              setModalQuantity(Math.max(1, parseInt(e.target.value) || 1))
                            }
                            className="w-16 p-1 border rounded"
                          />
                        </div>

                        <div className="mt-4 flex gap-3">
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={() => {
                              addToCart(selectedProduct, modalQuantity); 
                              toast.success("Added to cart!");
                              setIsModalOpen(false);
                              setModalQuantity(1); 
                            }}
                          >
                            Add to Cart
                          </button>

                          <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}