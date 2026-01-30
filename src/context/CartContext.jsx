import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("/api/cart");
      setCartItems(res.data || []);
    } catch (err) {
      console.error("fetchCart error:", err);
      // Don't show toast for 401 - interceptor handles it
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Failed to fetch cart");
      }
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user?._id, fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    // Check if user is logged in before attempting to add to cart
    if (!user?._id) {
      toast.error(
        (t) => (
          <span>
            Please login to add items to cart.{" "}
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
      return;
    }

    try {
      await api.post("/api/cart", { productId, quantity });
      await fetchCart();
      toast.success("Added to cart");
    } catch (err) {
      console.error("addToCart error:", err);
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Failed to add to cart");
      }
    }
  }, [user?._id, fetchCart]);

  const updateQuantity = useCallback(async (id, quantity) => {
    try {
      await api.put(`/api/cart/${id}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("updateQuantity error:", err);
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Failed to update quantity");
      }
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (id) => {
    await api.delete(`/api/cart/${id}`);
    await fetchCart();
  }, [fetchCart]);

  const incrementQuantity = useCallback(async (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;
    await updateQuantity(id, item.quantity + 1);
  }, [cartItems, updateQuantity]);

  const decrementQuantity = useCallback(async (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity - 1);
    await updateQuantity(id, newQty);
  }, [cartItems, updateQuantity]);

  const clearLocalCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await api.delete("/api/cart");
      setCartItems([]);
    } catch (err) {
      console.error("clearCart error:", err);
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Failed to clear cart");
      }
    }
  }, []);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    clearLocalCart
  }), [cartItems, addToCart, removeFromCart, updateQuantity, incrementQuantity, decrementQuantity, clearCart, clearLocalCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
