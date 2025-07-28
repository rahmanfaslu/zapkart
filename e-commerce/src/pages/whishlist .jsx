
import { useCart } from "../context/CartContext"; 
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

function whishlist() {
  const { whishlist, removeFromwhishlist } = usewhishlist();
  const { addToCart } = useCart(); 
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart(item);
    removeFromwhishlist(item); 
    toast.success("Item added to cart!");
  };

  return (
    <section className="py-10 bg-white px-4 ">
      <h1 className="text-center text-5xl font-bold mb-10 text-blue-600">whishlist</h1>

      {whishlist.length === 0 ? (
        <>
          <p className="text-center text-gray-500">Your whishlist is empty.</p>
          <div className="flex justify-center items-center min-h-10">
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
            >
              Browse Products
            </button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[20px] max-w-7xl mx-auto ">
          {whishlist.map((item) => (
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

              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => removeFromwhishlist(item)}
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
    </section>
  );
}

export default whishlist;
