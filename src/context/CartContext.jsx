import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user?._id]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems(res.data || []);
    } catch (err) {
      console.error("fetchCart error:", err);
      if (err.response?.status === 401) {
        logout().catch(() => { });
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to fetch cart");
      }
      setCartItems([]);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId, quantity },
        { withCredentials: true }
      );
      await fetchCart();
      toast.success("Added to cart");
    } catch (err) {
      console.error("addToCart error:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${id}`,
        { quantity },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (err) {
      console.error("updateQuantity error:", err);
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeFromCart = async (id) => {
    console.log("DELETE CLICKED, ID:", id);

    const res = await axios.delete(
      `http://localhost:5000/api/cart/${id}`,
      { withCredentials: true }
    );

    console.log("DELETE RESPONSE:", res.data);

    await fetchCart();
  };

  const incrementQuantity = async (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;
    await updateQuantity(id, item.quantity + 1);
  };

  const decrementQuantity = async (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity - 1);
    await updateQuantity(id, newQty);
  };

  const clearLocalCart = () => {
    setCartItems([]);
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart", { withCredentials: true });
      setCartItems([]);
    } catch (err) {
      console.error("clearCart error:", err);
      toast.error(err.response?.data?.message || "Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, incrementQuantity, decrementQuantity, clearCart, clearLocalCart }}>
      {children}
    </CartContext.Provider>
  );
};
