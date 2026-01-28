import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import toast from "react-hot-toast";

function Whishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item.product._id);
      await removeFromWishlist(item.product._id);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-10 bg-white px-4">
        <h1 className="text-center text-5xl font-bold mb-10 text-blue-600">Wishlist</h1>

        {wishlist.length === 0 ? (
          <>
            <p className="text-center text-gray-500">Your wishlist is empty.</p>
            <div className="flex justify-center items-center min-h-10 mt-4">
              <button
                onClick={() => navigate("/products")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
              >
                Browse Products
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[20px] max-w-7xl mx-auto">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-gray-100 p-4 rounded-xl shadow-md text-center"
              >
                <img
                  src={item.product?.images?.[0] || "/placeholder.png"}
                  alt={item.product?.title || "Product"}
                  className="w-24 mx-auto mb-3 object-contain"
                />
                <h3 className="text-lg font-semibold">{item.product?.title}</h3>
                <p className="text-gray-600">₹{item.product?.price}</p>

                <div className="flex justify-center gap-2 mt-3">
                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    <FaTrash className="inline mr-1" />
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    <FaCartShopping className="inline mr-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Whishlist;
