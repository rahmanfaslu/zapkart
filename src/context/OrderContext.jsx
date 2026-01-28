import { createContext, useContext, useState } from "react";
import api from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  const fetchUserOrders = async () => {
    try {
      if (!user) return;

      const res = await api.get("/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders failed:", err);
    }
  };

  const placeOrder = async (orderData) => {
    // Check if user is logged in before placing order
    if (!user?._id) {
      toast.error(
        (t) => (
          <span>
            Please login to place an order.{" "}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                window.location.href = "/login";
              }}
              className="font-bold underline text-blue-600"
            >
              Login
            </button>
          </span>
        ),
        { duration: 4000 }
      );
      throw new Error("User not logged in");
    }

    try {
      const res = await api.post("/api/orders", orderData);
      await fetchUserOrders();
      return res.data;
    } catch (err) {
      console.error("Place order failed:", err);
      throw err;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, fetchUserOrders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
