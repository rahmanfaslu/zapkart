// context/CartContext.js
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); 


  const addToCart = (product) => {
    // Optionally check for duplicates
    const isExist = cartItems.find((item) => item.id === product.id);
    if (!isExist) {
      setCartItems([...cartItems, product]);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
