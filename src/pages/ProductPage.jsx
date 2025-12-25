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
import getImageSrc from "../utils/getImageSrc";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const location = useLocation();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

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
    axios.get("http://localhost:5000/api/products")
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
        (item.name || item.title)?.toLowerCase().includes(searchQuery.toLowerCase())
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
    setCurrentPage(1);
  }, [searchQuery, category, sortOrder, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <section className="py-10 bg-gray-100 px-4">
      <h1 className="text-center text-3xl font-bold mb-6 text-blue-700">
        Our Products
      </h1>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {currentProducts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No products found.
          </p>
        ) : (
          currentProducts.map((item) => (
            <div
              key={item._id}
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
                  src={getImageSrc(item)}
                  alt={item.name || item.title}
                  className="mb-4 object-contain w-32 scale-125 transition-transform duration-300 mx-auto"
                />
                <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                <h2 className="text-base font-semibold text-gray-800 mb-1">{item.name || item.title}</h2>
                <p className="text-purple-700 font-bold text-lg mb-4">₹{item.price}</p>
              </div>

              <div className="flex justify-center items-center gap-3 mt-auto">
                <button
                  className={`text-xl ${wishlist.find((w) => w.product?._id === item._id)
                    ? "text-red-600"
                    : "text-gray-400 hover:text-red-600"
                    }`}
                  onClick={async () => {
                    const isInWishlist = wishlist.find(
                      (w) => w.product?._id === item._id
                    );
                    if (isInWishlist) {
                      await removeFromWishlist(item._id);
                    } else {
                      await addToWishlist(item._id);
                    }
                  }}
                >
                  <FaHeart />
                </button>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm"
                  onClick={async () => {
                    try {
                      await addToCart(item._id);
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

      {/* Pagination */}
      {filteredProducts.length > productsPerPage && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              &laquo; Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              Next &raquo;
            </button>
          </nav>
        </div>
      )}

      <Transition.Root show={isModalOpen} as={Fragment}>
      </Transition.Root>
    </section>
  );
}

export default Products;

//changes