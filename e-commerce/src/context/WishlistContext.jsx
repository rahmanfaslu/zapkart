import React, { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const alreadyInWishlist = prev.find((item) => item.id === product.id);
      if (alreadyInWishlist) {
        // If already in wishlist, remove it
        return prev.filter((item) => item.id !== product.id);
      } else {
        // If not in wishlist, add it
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (id) => {
    // This function can still be used directly if needed
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
