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
import { Dialog, Transition } from '@headlessui/react';
import api from "../utils/axiosInstance";
import toast from 'react-hot-toast';
import getImageSrc from "../utils/getImageSrc";

// Tailwind Safelist for dynamic slider classes (ensures they are not purged)
const SLIDER_SAFELIST = {
  bg: ['bg-blue-100', 'bg-purple-100', 'bg-green-100', 'bg-red-100'],
  button: [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500',
    'hover:bg-blue-700', 'hover:bg-purple-700', 'hover:bg-green-700', 'hover:bg-red-700'
  ],
  text: ['text-blue-500', 'text-purple-500', 'text-green-500', 'text-red-500']
}

const INITIAL_SLIDER_DATA = [
  {
    _id: "initial-1",
    title: "Beat Solo 2",
    subtitle: "Wireless Headset",
    description: "The Beats Solo 4 Cloud Pink blend premium design, immersive spatial audio, and all-day comfort in a lightweight package",
    bgColor: "bg-blue-100",
    titleColor: "text-gray-800",
    subtitleColor: "text-blue-500",
    buttonColor: "bg-blue-500 hover:bg-blue-700",
    image: "beat solo.png",
    sliderOrder: 1,
    category: "Headphones"
  },
  {
    _id: "initial-2",
    title: "AirPods Pro",
    subtitle: "Premium Earbuds",
    description: "Experience next-level sound with Active Noise Cancellation, Transparency mode, and Spatial Audio technology",
    bgColor: "bg-purple-100",
    titleColor: "text-gray-800",
    subtitleColor: "text-purple-500",
    buttonColor: "bg-purple-500 hover:bg-purple-700",
    image: "airpodes.png",
    sliderOrder: 2,
    category: "Headphones"
  },
  {
    _id: "initial-3",
    title: "Mac Studio",
    subtitle: "Powerful Computer",
    description: "A compact powerhouse built for creators, with lightning-fast M-series performance and pro-level features",
    bgColor: "bg-green-100",
    titleColor: "text-gray-800",
    subtitleColor: "text-green-500",
    buttonColor: "bg-green-500 hover:bg-green-700",
    image: "machub.png",
    sliderOrder: 3,
    category: "Laptops"
  },
  {
    _id: "initial-4",
    title: "MacBook Pro",
    subtitle: "Sports Wireless",
    description: "Designed for athletes with secure-fit ear hooks, sweat resistance, and powerful sound that motivates your workout",
    bgColor: "bg-red-100",
    titleColor: "text-gray-800",
    subtitleColor: "text-red-500",
    buttonColor: "bg-red-500 hover:bg-red-700",
    image: "macbook pro.png",
    sliderOrder: 4,
    category: "Laptops"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [sliderProducts, setSliderProducts] = useState(INITIAL_SLIDER_DATA);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { cartItems, addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [randomText, setRandomText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/products/slider")
      .then((res) => setSliderProducts(res.data))
      .catch((err) => console.error("Error fetching slider products:", err));
  }, []);

  useEffect(() => {
    api.get("/api/products")
      .then((res) => {
        setAllProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAutoSliding || sliderProducts.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderProducts.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [isAutoSliding, sliderProducts.length]);

  const getRandomText = () => {
    return marketingTexts[Math.floor(Math.random() * marketingTexts.length)];
  };

  const handleMouseEnter = () => setIsAutoSliding(false);
  const handleMouseLeave = () => setIsAutoSliding(true);

  const handleNavigateToCategory = (category) => {
    navigate("/products", { state: { category } });
  };

  const handleShopNow = (sliderProduct) => {
    if (!sliderProduct.category) {
      console.warn("Slider product missing category");
      return;
    }

    navigate("/products", {
      state: { category: sliderProduct.category }
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderProducts.length);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 3000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderProducts.length) % sliderProducts.length);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 3000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 3000);
  };

  const featuredProducts = allProducts.slice(0, 4);


  return (
    <div className="bg-gray-100 text-gray-800">

      <section id="home" className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="relative overflow-hidden rounded-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >

            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {sliderProducts.map((product) => (
                <div key={product._id} className="w-full flex-shrink-0">
                  <div className={`${product.bgColor}  md:h-125 h-auto rounded-2xl p-6 relative overflow-hidden`}>

                    {/* Desktop Layout */}
                    <div className="hidden md:block relative z-10">
                      <div className="flex items-center justify-between">
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
                            onClick={() => handleShopNow(product)}
                            className={`px-6 py-2 ${product.buttonColor || 'bg-blue-600 hover:bg-blue-700'} ml-20 mt-4 text-white rounded-lg transition duration-300 font-semibold`}
                          >
                            Shop Now
                          </button>
                        </div>

                        <div className="flex-1 flex justify-center items-center">
                          <img
                            src={`/${product.image}`}
                            alt={product.title}
                            loading={product.sliderOrder === 1 ? "eager" : "lazy"}
                            decoding="async"
                            {...(product.sliderOrder === 1 ? { fetchPriority: "high" } : {})}
                            className={`w-80 h-80 object-contain drop-shadow-2xl hover:scale-103 transition-transform duration-300 ${product.sliderOrder === 1 ? 'w-100 h-80 absolute top-[40px]' :
                              product.sliderOrder === 2 ? 'absolute top-[40px]' :
                                product.sliderOrder === 3 ? 'mr-10 pt-10 w-90 h-80' :
                                  product.sliderOrder === 4 ? 'absolute top-[40px] w-120 h-80' : ''
                              }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden relative z-10 py-8">
                      <div className="flex flex-col items-center text-center space-y-6">

                        {/* Text Content */}
                        <div className="w-full">
                          <h1 className={`text-4xl ${product.titleColor} font-bold mb-2`}>
                            {product.title}
                          </h1>
                          <h2 className={`text-xl ${product.subtitleColor} mb-4`}>
                            {product.subtitle}
                          </h2>
                          <p className={`text-sm ${product.titleColor} leading-relaxed px-4 max-w-md mx-auto`}>
                            {product.description}
                          </p>
                        </div>

                        {/* Image */}
                        <div className="w-full flex justify-center">
                          <img
                            src={`/${product.image}`}
                            alt={product.title}
                            loading={product.sliderOrder === 1 ? "eager" : "lazy"}
                            decoding="async"
                            className="w-64 h-64 object-contain drop-shadow-2xl"
                          />
                        </div>

                        {/* Button */}
                        <button
                          type="button"
                          onClick={() => handleShopNow(product)}
                          className={`px-8 py-3 ${product.buttonColor || 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition duration-300 font-semibold text-lg shadow-lg hover:shadow-xl`}
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>

                    {/* Background Circle - Desktop only */}
                    <div className="hidden md:block absolute right-10 top-1/2 transform -translate-y-1/2 w-64 h-64 mr-30 opacity-20">
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

            {/* Auto-slide indicator */}
            <div className="absolute top-4 right-4 z-20">
              <div
                className={`w-3 h-3 rounded-full ${isAutoSliding ? 'bg-green-500' : 'bg-red-500'} opacity-70`}
                title={isAutoSliding ? 'Auto-slide active' : 'Auto-slide paused'}
              ></div>
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {sliderProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${currentSlide === index
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
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Categories</h2>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4">
            <div
              className="w-full md:w-1/3 h-50 bg-gradient-to-br from-gray-800 to-black rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Headphones')}
            >
              <p className='text-white pl-4 md:pl-10 pt-8 z-10 relative'>Enjoy</p>
              <h2 className='text-white pl-4 md:pl-10 text-2xl font-bold z-10 relative'>With</h2>
              <h1 className='text-white text-3xl md:text-4xl pl-4 md:pl-[38px] font-bold z-10 relative'>EARPHONE</h1>
              <button
                type="button"
                className="w-20 h-10 ml-4 md:ml-[35px] bg-red-600 text-white py-2 rounded-full hover:bg-gray-700 transition duration-300 font-semibold z-10 relative"
              >
                Click
              </button>
              <img src="https://static.vecteezy.com/system/resources/thumbnails/047/829/266/small_2x/earphones-for-music-on-transparent-background-png.png" alt="Earphone" className="absolute bottom-0 right-4 md:right-10 w-40 md:w-50 opacity-90" />
            </div>

            <div
              className="w-full md:w-1/3 h-50 bg-yellow-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Watches')}
            >
              <p className='text-white pl-4 md:pl-10 pt-8 z-10 relative'>Smart</p>
              <h2 className='text-white pl-4 md:pl-10 text-2xl font-bold z-10 relative'>Wear</h2>
              <h1 className='text-white text-3xl md:text-4xl pl-4 md:pl-[38px] font-bold z-10 relative'>WATCH</h1>
              <button type="button" className="w-20 h-10 ml-4 md:ml-[35px] bg-white text-yellow-500 py-2 rounded-full hover:bg-gray-800 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img src="https://png.pngtree.com/png-clipart/20240305/original/pngtree-yellow-smart-watch-with-straps-and-blank-screen-png-image_14512452.png" alt="Watch" className="absolute bottom-5 right-2 w-40 md:w-50 opacity-90" />
            </div>

            <div
              className="w-full md:w-1/2 h-50 bg-gradient-to-br from-red-600 to-red-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Laptops')}
            >
              <p className='text-white pl-4 md:pl-10 pt-8 z-10 relative'>Power</p>
              <h2 className='text-white pl-4 md:pl-10 text-2xl font-bold z-10 relative'>With</h2>
              <h1 className='text-white text-3xl md:text-4xl pl-4 md:pl-[38px] font-bold z-10 relative'>LAPTOP</h1>
              <button type="button" className="w-20 h-10 ml-4 md:ml-[35px] bg-white text-red-600 py-2 rounded-full hover:bg-red-300 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img src="https://www.pngmart.com/files/23/Macbook-Pro-PNG.png" alt="Laptop" className="absolute bottom-0 right-3 w-40 md:w-50 opacity-90" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4">
            <div
              className="w-full md:w-1/2 h-50 bg-gray-300 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Gaming')}
            >
              <p className='text-black pl-4 md:pl-10 pt-8 z-10 relative'>Best</p>
              <h2 className='text-black pl-4 md:pl-10 text-2xl font-bold z-10 relative'>Gaming</h2>
              <h1 className='text-black text-3xl md:text-4xl pl-4 md:pl-[38px] font-bold z-10 relative'>CONSOLE</h1>
              <button type="button" className="w-20 h-10 ml-4 md:ml-[35px] bg-red-600 text-white py-2 rounded-full hover:bg-gray-400 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img src="https://www.esrb.org/wp-content/uploads/2024/09/ps4.webp" alt="Console" className="absolute bottom-0 right-3 w-40 md:w-50 opacity-90" />
            </div>

            <div
              className="w-full md:w-1/3 h-50 bg-blue-500 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('AR')}
            >
              <p className='text-white pl-4 md:pl-10 pt-8 z-10 relative'>Play</p>
              <h2 className='text-white pl-4 md:pl-10 text-2xl font-bold z-10 relative'>Game</h2>
              <h1 className='text-white text-3xl md:text-4xl pl-4 md:pl-[38px] font-bold z-10 relative'>OCULUS</h1>
              <button type="button" className="w-20 h-10 ml-4 md:ml-[35px] bg-white text-blue-500 py-2 rounded-full hover:bg-blue-300 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img
                src="https://static.vecteezy.com/system/resources/previews/024/724/530/non_2x/virtual-reality-or-vr-headset-isolated-on-transparent-background-vr-glasses-for-360-environment-games-or-simulation-training-generative-ai-free-png.png"
                alt="Oculus"
                loading="lazy"
                decoding="async"
                className="absolute bottom-0 right-3 w-40 md:w-50 opacity-90"
              />
            </div>

            <div
              className="w-full md:w-1/3 h-50 bg-gradient-to-br from-green-600 to-green-400 rounded-[20px] relative overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleNavigateToCategory('Speaker')}
            >
              <p className='text-white pl-4 md:pl-10 pt-8 z-10 relative'>New</p>
              <h2 className='text-white pl-4 md:pl-10 text-2xl font-bold z-10 relative'>Smart</h2>
              <h1 className='text-white text-3xl md:text-4xl pl-4 md:pl-[38px] font-bold z-10 relative'>SPEAKER</h1>
              <button type="button" className="w-20 h-10 ml-4 md:ml-[35px] bg-white text-green-600 py-2 rounded-full hover:bg-green-300 transition duration-300 font-semibold z-10 relative">
                Click
              </button>
              <img
                src="https://www.pngarts.com/files/12/Portable-Bluetooth-Speaker-PNG-Photo.png"
                alt="Speaker"
                loading="lazy"
                decoding="async"
                className="absolute bottom-0 right-3 w-40 md:w-50 opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* featured products Section */}
      <section className="py-8 md:py-15 bg-gray-100 px-4">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-blue-700">
          Featured Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7 max-w-7xl mx-auto px-4 md:px-8">
          {isLoading ? (
            // Skeleton Loader
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="max-w-xs mx-auto w-full rounded-xl bg-white shadow-lg p-4 md:p-5 flex flex-col items-center animate-pulse">
                <div className="w-full h-32 md:h-36 bg-gray-200 rounded-lg mb-4"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded mb-2"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-1/4 h-5 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2 w-full mt-auto">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 h-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <div
                key={product._id}
                className="max-w-xs mx-auto w-full rounded-xl bg-white shadow-lg p-4 md:p-5 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-full h-32 md:h-36 flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    src={getImageSrc(product)}
                    alt={product.name || product.title}
                    loading="lazy"
                    decoding="async"
                    className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="text-xs md:text-sm text-gray-500 mb-1">{product.category}</p>
                <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-1 line-clamp-2">{product.name || product.title}</h2>
                <p className="text-black font-bold text-base md:text-lg mb-4">₹{product.price}</p>

                <div className="flex justify-center items-center gap-2 md:gap-3 mt-auto w-full">
                  <button
                    className={`text-lg md:text-xl p-2 rounded-full transition-colors ${wishlist.find((w) => w.product?._id === product._id)
                      ? "text-red-600 bg-red-50"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                      }`}
                    onClick={async () => {
                      const isInWishlist = wishlist.find((w) => w.product?._id === product._id);
                      if (isInWishlist) {
                        await removeFromWishlist(product._id);
                      } else {
                        await addToWishlist(product._id);
                      }
                    }}
                  >
                    <FaHeart />
                  </button>

                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors flex-1 max-w-[120px]"
                    onClick={async () => {
                      try {
                        await addToCart(product._id);
                      } catch (err) {
                        toast.error("Failed to add to cart");
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
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
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm sm:max-w-md md:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                  {selectedProduct && (
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">

                      {/* Mobile: Smaller image */}
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-48 sm:h-56 md:w-1/2 md:h-auto object-contain rounded-lg"
                      />

                      <div className="flex-1 space-y-2 md:space-y-3">
                        {/* Compact title */}
                        <Dialog.Title as="h2" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                          {selectedProduct.title}
                        </Dialog.Title>

                        {/* Smaller random text */}
                        <p className="text-xs sm:text-sm text-gray-500 italic line-clamp-2">
                          {randomText}
                        </p>

                        {/* Compact description */}
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 md:line-clamp-none">
                          {selectedProduct.description}
                        </p>

                        {/* Price and category in one row on mobile */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <p className="text-gray-900 font-bold text-lg sm:text-xl">
                            ₹{selectedProduct.price}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {selectedProduct.category}
                          </p>
                        </div>

                        {/* Compact wishlist and quantity row */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            className={`text-lg sm:text-xl ${wishlist.find((w) => w.product?._id === selectedProduct._id)
                              ? "text-red-600"
                              : "text-gray-400 hover:text-red-600"
                              } transition-colors`}
                            onClick={async () => {
                              const isInWishlist = wishlist.find((w) => w.product?._id === selectedProduct._id);
                              if (isInWishlist) {
                                await removeFromWishlist(selectedProduct._id);
                              } else {
                                await addToWishlist(selectedProduct._id);
                              }
                            }}
                          >
                            <FaHeart />
                          </button>

                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Qty:</label>
                            <input
                              type="number"
                              min="1"
                              value={modalQuantity}
                              onChange={(e) =>
                                setModalQuantity(Math.max(1, parseInt(e.target.value) || 1))
                              }
                              className="w-12 sm:w-16 p-1 border rounded text-sm text-center"
                            />
                          </div>
                        </div>

                        {/* Compact button row */}
                        <div className="flex gap-2 pt-2">
                          <button
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
                            onClick={async () => {
                              try {
                                await addToCart(selectedProduct._id, modalQuantity);
                                setIsModalOpen(false);
                                setModalQuantity(1);
                              } catch (err) {
                                toast.error("Failed to add to cart");
                              }
                            }}
                          >
                            Add to Cart
                          </button>

                          <button
                            className="px-3 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
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