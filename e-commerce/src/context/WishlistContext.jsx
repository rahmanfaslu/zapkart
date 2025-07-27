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
        console.log("Raw wishlist data from API:", res.data);
        
        // Make sure we're mapping the ID correctly
        const mappedWishlist = res.data.map((item) => {
          console.log("Mapping item:", item);
          return {
            ...item,
            dbId: item.id, // This should be the database ID
            id: item.productId || item.id // This should be the product ID
          };
        });
        
        console.log("Mapped wishlist:", mappedWishlist);
        setWishlist(mappedWishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [user]);

  // Toggle add/remove item
  const addToWishlist = async (product) => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    console.log("Product to toggle:", product);
    console.log("Current wishlist:", wishlist);

    // Find existing item by product ID (not database ID)
    const existing = wishlist.find((item) => item.id === product.id);
    console.log("Existing item found:", existing);

    try {
      if (existing) {
        // Remove from wishlist
        console.log("Attempting to delete with dbId:", existing.dbId);
        
        // First check if the item exists in database
        try {
          const checkResponse = await axios.get(`http://localhost:3001/wishlist/${existing.dbId}`);
          console.log("Item exists in database:", checkResponse.data);
        } catch (checkError) {
          console.log("Item doesn't exist in database, removing from local state only");
          setWishlist((prev) => prev.filter((item) => item.id !== product.id));
          return;
        }
        
        // If item exists, delete it
        await axios.delete(`http://localhost:3001/wishlist/${existing.dbId}`);
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        
      } else {
        // Add to wishlist
        const newItem = { 
          ...product, 
          userId: user.id,
          productId: product.id // Store the product ID separately
        };
        
        console.log("Adding new item:", newItem);
        const res = await axios.post("http://localhost:3001/wishlist", newItem);
        console.log("Add response:", res.data);
        
        setWishlist((prev) => [...prev, { 
          ...product, 
          dbId: res.data.id,
          id: product.id 
        }]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      
      // If it's a 404 error when trying to delete, the item might not exist in DB
      if (error.response?.status === 404 && existing) {
        console.log("404 error - removing from local state only");
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        return; // Don't throw the error, just remove locally
      }
      
      throw error;
    }
  };

  // Alternative: Remove by userId and productId instead of dbId
  const removeFromWishlistAlt = async (product) => {
    if (!user?.id) return;

    try {
      // Try deleting by userId and productId query params instead of dbId
      await axios.delete(`http://localhost:3001/wishlist?userId=${user.id}&productId=${product.id}`);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  };

  // Remove from wishlist (explicit removal)
  const removeFromWishlist = async (product) => {
    if (!product?.dbId) {
      // Fallback to alternative method
      return removeFromWishlistAlt(product);
    }

    try {
      await axios.delete(`http://localhost:3001/wishlist/${product.dbId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } catch (error) {
      if (error.response?.status === 404) {
        // Item doesn't exist in DB, just remove from local state
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        return;
      }
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  };

  // Clear entire wishlist
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

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};