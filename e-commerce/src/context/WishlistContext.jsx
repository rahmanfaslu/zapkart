// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist for the logged-in user
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`http://localhost:3001/wishlist?userId=${user.id}`);
        setWishlist(res.data.map((item) => ({ ...item, dbId: item.id }))); // keep dbId separate
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [user]);

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

  const removeFromWishlist = async (product) => {
    if (!product?.dbId) return;

    try {
      await axios.delete(`http://localhost:3001/wishlist/${product.dbId}`);
      setWishlist((prev) => prev.filter((i) => i.id !== product.id));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
