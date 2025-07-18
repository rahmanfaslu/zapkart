import { useWishlist } from "../context/WishlistContext";
import { FaTrash } from "react-icons/fa";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <section className="py-10 bg-white px-4">
      <h1 className="text-center text-3xl font-bold mb-10 text-red-600">
        Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 p-4 rounded-xl shadow-md text-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 mx-auto mb-3"
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600">₹{item.price}</p>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                <FaTrash className="inline mr-1" />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
