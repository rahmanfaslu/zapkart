import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  const { wishlist, addToWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get("http://localhost:3001/Products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => console.error("There is an error:", err));
  }, []);

  // Filter + Sort Products whenever something changes
  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by search
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "All") {
      updatedProducts = updatedProducts.filter(
        (item) => item.category === category
      );
    }

    // Sort by price
    if (sortOrder === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, category, sortOrder, products]);

  // Get unique categories
  const categories = ["All", , ...new Set(products.map((p) => p.category))];

  return (
    <section className="py-10 bg-gray-100 px-4">
      <h1 className="text-center text-3xl font-bold mb-6 text-blue-700">
        Our Products
      </h1>

      {/*  Filters and Sorting */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="border p-2 rounded w-full md:w-1/3"
        />

        {/* Category Filter */}
        <select
         value={category}
         onChange={(e) => setCategory(e.target.value)}
       className="border p-2 rounded w-full md:w-1/4"
        >
         {categories.map((cat, index) => (
       <option key={index} value={cat} >
           {cat}
       </option>
        ))}
       </select>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">Sort by</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/*  Products Grid */}
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
              <img
                src={item.image}
                alt={item.title}
                className="mb-4 object-contain w-32 scale-125 transition-transform duration-300"
              />
              <p className="text-sm text-gray-500 mb-1">{item.category}</p>
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                {item.title}
              </h2>
              <p className="text-purple-700 font-bold text-lg mb-4">
                ₹{item.price}
              </p>
              <div className="flex justify-center items-center gap-3 mt-auto">
                <button
                  className={`text-xl ${
                    wishlist.find((w) => w.id === item.id)
                      ? "text-red-600"
                      : "text-gray-400 hover:text-red-600"
                  }`}
                  onClick={() => {
                    addToWishlist(item);
                    alert("Added to Wishlist");
                  }}
                >
                  <FaHeart />
                </button>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm"
                  onClick={() => {
                    addToCart(item);
                    alert("Added to Cart");
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
    
  );
}

export default Products;
