// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // 🛑 Dummy userId (replace with real user ID from auth context if needed)
  const userId = 1;

  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3001/cart?userId=${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    try {
      const res = await axios.get(`http://localhost:3001/cart?userId=${userId}&id=${product.id}`);
      const existing = res.data[0];

      if (existing) {
        // If already in cart, increase quantity
        await axios.patch(`http://localhost:3001/cart/${existing.id}`, {
          quantity: existing.quantity + 1
        });
      } else {
        // Add new product
        await axios.post("http://localhost:3001/cart", {
          ...product,
          quantity: 1,
          userId
        });
      }

      fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const incrementQty = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      await axios.patch(`http://localhost:3001/cart/${id}`, {
        quantity: item.quantity + 1
      });
      fetchCart();
    }
  };

  const decrementQty = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      await axios.patch(`http://localhost:3001/cart/${id}`, {
        quantity: item.quantity - 1
      });
    } else if (item && item.quantity === 1) {
      await axios.delete(`http://localhost:3001/cart/${id}`);
    }
    fetchCart();
  };

  const clearCart = async () => {
    const deleteAll = cartItems.map((item) =>
      axios.delete(`http://localhost:3001/cart/${item.id}`)
    );
    await Promise.all(deleteAll);
    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQty,
        decrementQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
