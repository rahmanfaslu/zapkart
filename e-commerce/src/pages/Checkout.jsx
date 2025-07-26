import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { placeOrder } = useOrder();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = Object.values(address).every((value) => value.trim() !== "");
    if (!isValid) {
      alert("Please fill in all address fields.");
      return;
    }

    const newOrder = {
      items: cartItems,
      address: `${address.name}, ${address.phone}, ${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
      paymentMethod,
      total: cartItems.reduce((acc, item) => acc + item.price, 0),
      date: new Date().toLocaleString(),
    };

    placeOrder(newOrder);
    clearCart();
    alert(`Order placed with ${paymentMethod.toUpperCase()} successfully!`);
    navigate("/order");
  };

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "phone", "address", "city", "state", "pincode"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={address[field]}
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 mt-6"
          >
            Place Order
          </button>
        </form>
      </div>
    </section>
  );
}
