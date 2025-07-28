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

        const mappedWishlist = res.data.map((item) => ({
          ...item,
          dbId: item.id,
          id: item.productId || item.id,
        }));

        setWishlist(mappedWishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user?.id) throw new Error("User not authenticated");

    const existing = wishlist.find((item) => item.id === product.id);

    try {
      if (existing) {
        await axios.delete(`http://localhost:3001/wishlist/${existing.dbId}`);
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      } else {
        const newItem = {
          ...product,
          userId: user.id,
          productId: product.id,
        };

        const res = await axios.post("http://localhost:3001/wishlist", newItem);

        setWishlist((prev) => [
          ...prev,
          {
            ...product,
            dbId: res.data.id,
            id: product.id,
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);

      if (error.response?.status === 404 && existing) {
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        return;
      }

      throw error;
    }
  };

  const removeFromWishlist = async (product) => {
    if (!product?.dbId) {
      return removeFromWishlistAlt(product);
    }

    try {
      await axios.delete(`http://localhost:3001/wishlist/${product.dbId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } catch (error) {
      if (error.response?.status === 404) {
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        return;
      }
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  };

  const removeFromWishlistAlt = async (product) => {
    if (!user?.id) return;

    try {
      await axios.delete(`http://localhost:3001/wishlist?userId=${user.id}&productId=${product.id}`);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
