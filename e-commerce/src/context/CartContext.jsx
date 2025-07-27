import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userKey = user?.email || "guest";

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem(`cartItems_${userKey}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (userKey) {
      localStorage.setItem(`cartItems_${userKey}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userKey]);

  // Update cart when user changes (login/logout)
  useEffect(() => {
    const stored = localStorage.getItem(`cartItems_${userKey}`);
    setCartItems(stored ? JSON.parse(stored) : []);
  }, [userKey]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(`cartItems_${userKey}`);
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
