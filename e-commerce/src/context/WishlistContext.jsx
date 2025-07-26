import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        setWishlist([]); 
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3001/wishlist?userId=${user.id}`);
        setWishlist(res.data.map((item) => ({ ...item, dbId: item.id })));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [user]);

  // Toggle add/remove item
  const addToWishlist = async (product) => {
    const existing = wishlist.find((item) => item.id === product.id);

    if (existing) {
      await axios.delete(`http://localhost:3001/wishlist/${existing.dbId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      const newItem = { ...product, userId: user.id };
      const res = await axios.post("http://localhost:3001/wishlist", newItem);
      setWishlist((prev) => [...prev, { ...product, dbId: res.data.id }]);
    }
  };

  // remove wishlist
  const removeFromWishlist = async (product) => {
    if (!product?.dbId) return;

    try {
      await axios.delete(`http://localhost:3001/wishlist/${product.dbId}`);
      setWishlist((prev) => prev.filter((i) => i.id !== product.id));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // to Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
