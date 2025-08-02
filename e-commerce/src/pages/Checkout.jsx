import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { placeOrder } = useOrder();
  const { cartItems, clearCart } = useCart();
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
    setIsProcessing(true);

    // Validation
    const isValid = Object.values(address).every((value) => value.trim() !== "");
    if (!isValid) {
      toast.error("Please fill in all address fields");
      setIsProcessing(false);
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      setIsProcessing(false);
      return;
    }

    const newOrder = {
      userId: user?.email,
      items: cartItems.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingAddress: address,
      paymentMethod,
      total: cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0),
      status: "processing",
      createdAt: new Date().toISOString()
    };

    try {
      await placeOrder(newOrder);
    } catch (error) {
      console.error("placeOrder error:", error);
      toast.error("Failed to place order.");
      setIsProcessing(false);
      return;
    }

    try {
      await clearCart();
    } catch (error) {
      console.error("clearCart error:", error);
      toast.error("Order placed, but failed to clear cart.");
    }

    toast.success("Order placed successfully!");
    navigate("/order");
    setIsProcessing(false);
  };

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(address).map(([field, value]) => (
            <input
              key={field}
              type={field === "phone" ? "tel" : "text"}
              name={field}
              value={value}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-blue-500"
              required
            />
          ))}

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Select Payment Method</h3>
            <div className="space-y-2">
              {["cod", "upi", "card"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-blue-600"
                  />
                  {method === "cod"
                    ? "Cash on Delivery"
                    : method === "upi"
                    ? "UPI"
                    : "Credit/Debit Card"}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 mt-6 transition ${
              isProcessing ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </section>
  );
}
