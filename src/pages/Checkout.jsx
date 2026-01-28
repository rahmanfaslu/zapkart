import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../services/paymentService";

export default function CheckoutPage() {
  const { placeOrder } = useOrder();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems.length) return toast.error("Your cart is empty");

    const isValid = Object.values(address).every(v => v.trim());
    if (!isValid) return toast.error("Fill all address fields");

    if (paymentMethod === "cod") {
      placeCodOrder();
    } else {
      handleRazorpayPayment();
    }
  };

  const placeCodOrder = async () => {
    try {
      setIsProcessing(true);

      await placeOrder({
        shippingAddress: address,
        paymentMethod: "COD",
      });

      toast.success("Order placed successfully");
      navigate("/order");
    } catch {
      toast.error("Order failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      const { data: order } = await createOrder(totalAmount);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Shingify",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          await verifyPayment(response);

          await placeOrder({
            shippingAddress: address,
            paymentMethod: "Razorpay",
            paymentResult: response,
          });

          toast.success("Payment successful");
          navigate("/order");
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setIsProcessing(false);
          }
        },
        theme: { color: "#000" }
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment failed");
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
            {["cod", "upi", "card"].map(m => (
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
