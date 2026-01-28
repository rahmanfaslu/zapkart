import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await api.get("/api/wishlist");
      setWishlist(res.data || []);
    } catch (err) {
      console.error("fetchWishlist error:", err);
      // Don't show toast for 401 - interceptor handles it
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Failed to fetch wishlist");
      }
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user?._id, fetchWishlist]);

  const addToWishlist = useCallback(async (productId) => {
    // Check if user is logged in before attempting to add to wishlist
    if (!user?._id) {
      toast.error(
        (t) => (
          <span>
            Please login to add items to wishlist.{" "}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                window.location.href = "/login";
              }}
              className="font-bold underline text-blue-600"
            >
              Login
            </button>
          </span>
        ),
        { duration: 4000 }
      );
      return;
    }

    try {
      await api.post("/api/wishlist", { productId });
      await fetchWishlist();
      toast.success("Added to wishlist");
    } catch (err) {
      console.error("addToWishlist error:", err);
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Failed to add to wishlist");
      }
    }
  }, [user?._id, fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    // Check if user is logged in
    if (!user?._id) {
      toast.error(
        (t) => (
          <span>
            Please login to manage your wishlist.{" "}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                window.location.href = "/login";
              }}
              className="font-bold underline text-blue-600"
            >
              Login
            </button>
          </span>
        ),
        { duration: 4000 }
      );
      return;
    }

    try {
      await api.delete(`/api/wishlist/${productId}`);
      await fetchWishlist();
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("removeFromWishlist error:", err);
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Failed to remove from wishlist");
      }
    }
  }, [user?._id, fetchWishlist]);

  const clearLocalWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const value = useMemo(() => ({
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearLocalWishlist
  }), [wishlist, addToWishlist, removeFromWishlist, clearLocalWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
