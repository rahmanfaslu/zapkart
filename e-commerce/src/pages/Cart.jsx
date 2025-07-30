import { useCart } from "../context/CartContext";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CartPage() {
  const {
    cartItems = [],
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCart();

  const navigate = useNavigate();
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <section className="py-10 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-5 text-center">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/products")}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl shadow flex items-center gap-6"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-contain rounded"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <p className="text-purple-700 font-bold mt-2">
                    ₹{item.price} each
                  </p>

                  <div className="flex items-center mt-2 space-x-3">
                    <button
                      className="bg-gray-200 text-lg px-3 rounded hover:bg-gray-300"
                      onClick={() => decrementQuantity(item.id)}
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      className="bg-gray-200 text-lg px-3 rounded hover:bg-gray-300"
                      onClick={() => incrementQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    Total: ₹{item.price * item.quantity}
                  </p>
                </div>

                <button
                  className="text-red-600 hover:text-red-800 text-xl"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}

            <div className="text-right mt-6">
              <h3 className="text-xl font-semibold">
                Subtotal:{" "}
                <span className="text-green-600 font-bold">
                  ₹{totalAmount}
                </span>
              </h3>
              <button
                className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartPage;
