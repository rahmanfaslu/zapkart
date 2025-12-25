import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user?._id]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        withCredentials: true,
      });
      setWishlist(res.data || []);
    } catch (err) {
      console.error("fetchWishlist error:", err);
      if (err.response?.status === 401) {
        logout().catch(() => { });
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to fetch wishlist");
      }
      setWishlist([]);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/wishlist",
        { productId },
        { withCredentials: true }
      );
      await fetchWishlist();
      toast.success("Added to wishlist");
    } catch (err) {
      console.error("addToWishlist error:", err);
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        withCredentials: true,
      });
      await fetchWishlist();
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("removeFromWishlist error:", err);
      toast.error(err.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  const clearLocalWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearLocalWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
