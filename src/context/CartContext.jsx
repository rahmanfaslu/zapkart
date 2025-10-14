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
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/cart?userId=${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const existing = cartItems.find((item) => item.productId === product.id);

    if (existing) {
      const updated = { 
        ...existing, 
        quantity: existing.quantity + quantity 
      };
      await axios.put(`http://localhost:5000/cart/${existing.id}`, updated);
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
      await axios.post("http://localhost:5000/cart", newItem);
      setCartItems((prev) => [...prev, newItem]);
    }
  };

  const removeFromCart = async (id) => {
    await axios.delete(`http://localhost:5000/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementQuantity = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const updated = { ...item, quantity: item.quantity + 1 };
    await axios.put(`http://localhost:5000/cart/${id}`, updated);
    setCartItems((prev) =>
      prev.map((itm) => (itm.id === id ? updated : itm))
    );
  };

  const decrementQuantity = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item || item.quantity <= 1) return;

    const updated = { ...item, quantity: item.quantity - 1 };
    await axios.put(`http://localhost:5000/cart/${id}`, updated);
    setCartItems((prev) =>
      prev.map((itm) => (itm.id === id ? updated : itm))
    );
  };

  const clearCart = async () => {
  try {
    if (!userId) return;

    // Fetch cart items for the logged-in user directly from the DB
    const res = await axios.get(`http://localhost:5000/cart?userId=${userId}`);
    const userCartItems = res.data;

    // Delete each item one by one from server
    await Promise.all(
      userCartItems.map((item) =>
        axios.delete(`http://localhost:5000/cart/${item.id}`)
      )
    );

    // Clear local state
    setCartItems([]);
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};