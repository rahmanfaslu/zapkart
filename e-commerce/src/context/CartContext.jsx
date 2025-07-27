// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const userId = user?.email;

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3001/cart?userId=${userId}`)
        .then((res) => setCartItems(res.data))
        .catch((err) => console.error("Error loading cart:", err));
    } else {
      setCartItems([]);
    }
  }, [userId]);

  const addToCart = async (product, quantity = 1) => {
    const existing = cartItems.find((item) => item.productId === product.id);

    if (existing) {
      const updated = { ...existing, quantity: existing.quantity + quantity };
      await axios.put(`http://localhost:3001/cart/${existing.id}`, updated);
      setCartItems((prev) =>
        prev.map((item) => (item.id === existing.id ? updated : item))
      );
    } else {
      const newItem = {
        id: uuidv4(),
        userId,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
      };
      await axios.post("http://localhost:3001/cart", newItem);
      setCartItems((prev) => [...prev, newItem]);
    }
  };

  const removeFromCart = async (id) => {
    await axios.delete(`http://localhost:3001/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]); // ✅ Clear only frontend state
    // ❌ Do NOT delete from backend here
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
