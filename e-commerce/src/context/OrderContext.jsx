// src/context/OrderContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  // Fetch user 
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`http://localhost:3001/orders?userId=${user.id}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const placeOrder = async (newOrder) => {
    try {
      const orderToSave = {
        ...newOrder,
        userId: user.id,
        date: new Date().toLocaleString(),
      };
      const res = await axios.post("http://localhost:3001/orders", orderToSave);
      setOrders((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);
