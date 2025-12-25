import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { placeOrder } = useOrder();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      toast.error("Your cart is empty!");
      return;
    }

    const isValid = Object.values(address).every(v => v.trim() !== "");
    if (!isValid) {
      toast.error("Please fill all address fields");
      return;
    }

    setIsProcessing(true);

    try {
      await placeOrder({
        shippingAddress: address,
        paymentMethod,
      });

      toast.success("Order placed successfully!");
      navigate("/order");
    } catch (err) {
      toast.error("Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Checkout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(address).map(([field, value]) => (
            <input
              key={field}
              type={field === "phone" ? "tel" : "text"}
              name={field}
              value={value}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              className="w-full px-4 py-2 border rounded"
              required
            />
          ))}

          <div>
            <h3 className="font-semibold mb-2">Payment Method</h3>
            {["cod", "upi", "card"].map((m) => (
              <label key={m} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={m}
                  checked={paymentMethod === m}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {m.toUpperCase()}
              </label>
            ))}
          </div>

          <button
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </section>
  );
}
