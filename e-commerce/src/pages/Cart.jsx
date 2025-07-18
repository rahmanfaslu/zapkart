import { useCart } from "../context/CartContext";
import { FaTrashAlt } from "react-icons/fa";

function CartPage() {
  const { cart, removeFromCart } = useCart();

  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  return (
    <section className="py-10 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty 🛒</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
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
                  <p className="text-purple-700 font-bold mt-2">₹{item.price}</p>
                </div>

                <button
                  className="text-red-600 hover:text-red-800 text-xl"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}

            {/* Subtotal */}
            <div className="text-right mt-6">
              <h3 className="text-xl font-semibold">
                Subtotal: <span className="text-green-600">₹{totalAmount}</span>
              </h3>
              <button className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
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
