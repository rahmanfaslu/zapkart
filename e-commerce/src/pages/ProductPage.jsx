import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import { BiSortAlt2 } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import toast from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  const { wishlist, addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  const location = useLocation();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);

  const marketingTexts = [
    "Best choice for everyday use!",
    "Loved by thousands of customers.",
    "Limited stock. Hurry up!",
    "Top-rated product in its category.",
    "You won't regret this purchase!"
  ];

  function getRandomText() {
    return marketingTexts[Math.floor(Math.random() * marketingTexts.length)];
  }

  const [randomText, setRandomText] = useState("");

 useEffect(() => {
  if (location.state && location.state.category) {
    setCategory(location.state.category);
  }
}, [location.state]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/Products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => console.error("There is an error:", err));
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    if (searchQuery) {
      updatedProducts = updatedProducts.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category !== "All") {
      updatedProducts = updatedProducts.filter(
        (item) => item.category === category
      );
    }

    if (sortOrder === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, category, sortOrder, products]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <section className="py-10 bg-gray-100 px-4">
      <h1 className="text-center text-3xl font-bold mb-6 text-blue-700">
        Our Products
      </h1>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <div className="relative w-full md:w-1/3">
  <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500 text-xl" />
  
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search products..."
    className="pl-10 border p-2 rounded w-full"
  />
</div>

        <div className="relative w-full md:w-1/4">
  <BiCategory className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500 text-xl" />
  
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="pl-10 border p-2 rounded w-full appearance-none"
  >
    {categories.map((cat, index) => (
      <option key={index} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>

        <div className="relative w-full md:w-1/4">
  <BiSortAlt2 className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-black-800 text-xl" />
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="border pl-10 pr-2 py-2 rounded w-full appearance-none"
  >
    <option value="">Sort by</option>
    <option value="lowToHigh">Price: Low to High</option>
    <option value="highToLow">Price: High to Low</option>
  </select>
</div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No products found.
          </p>
        ) : (
          filteredProducts.map((item) => (
            <div
              key={item.id}
              className="w-[97%] rounded-xl bg-white shadow-lg p-5 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.03] duration-300"
            >
              <div
                className="cursor-pointer w-full"
                onClick={() => {
                  setSelectedProduct(item);
                  setModalQuantity(1);
                  setRandomText(getRandomText());
                  setIsModalOpen(true);
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="mb-4 object-contain w-32 scale-125 transition-transform duration-300 mx-auto"
                />
                <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                <h2 className="text-base font-semibold text-gray-800 mb-1">{item.title}</h2>
                <p className="text-purple-700 font-bold text-lg mb-4">₹{item.price}</p>
              </div>

              {/* Wishlist ,Add to Cart */}
              <div className="flex justify-center items-center gap-3 mt-auto">
                <button
                  className={`text-xl ${
                    wishlist.find((w) => w.id === item.id)
                      ? "text-red-600"
                      : "text-gray-400 hover:text-red-600"
                  }`}
                  onClick={() => {
                    const isInWishlist = wishlist.find((w) => w.id === item.id);
                    addToWishlist(item);
                    toast.success(
                      isInWishlist
                        ? "Removed from Wishlist"
                        : "Added to Wishlist"
                    );
                  }}
                >
                  <FaHeart />
                </button>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm"
                  onClick={() => {
                    addToCart(item);
                    toast.success("Item added to cart!");
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
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
                    <div className="flex flex-col md:flex-row gap-4 ">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        className="w-full md:w-1/2 object-contain"
                      />

                      <div className="flex-1 space-y-3 mt-2">
                        <Dialog.Title as="h2" className="text-3xl font-bold text-gray-800">
                          {selectedProduct.title}
                        </Dialog.Title>

                        {/* Random Marketing text */}
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

                        {/* Wishlist inside modal */}
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

                        {/* Quantity, Add to Cart */}
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
    </section>

    
  );
}

export default Products;