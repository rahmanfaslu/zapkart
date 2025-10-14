import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  const fetchUserOrders = async () => {
    try {
      if (!user?.email) return;
      const response = await axios.get(
        `http://localhost:5000/orders?userId=${user.email}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const placeOrder = async (order) => {
  try {
    const res = await axios.post("http://localhost:5000/orders", order);
    return res.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};


  return (
    <OrderContext.Provider value={{ orders, placeOrder, fetchUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
};