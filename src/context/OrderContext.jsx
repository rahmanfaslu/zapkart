import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  const fetchUserOrders = async () => {
    try {
      if (!user) return;

      const res = await axios.get("http://localhost:5000/api/orders", {
        withCredentials: true,
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders failed:", err);
    }
  };

  const placeOrder = async (orderData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        { withCredentials: true }
      );

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
