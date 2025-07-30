import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        setWishlist([]);
        return;
      }

      setLoading(true);
      setError(null);

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
        setError("Failed to load wishlist");
        const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
        setWishlist(localWishlist);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const syncWithLocalStorage = (updatedWishlist) => {
    if (user?.id) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    }
  };

  const addToWishlist = async (product) => {
    if (!user?.id) throw new Error("User not authenticated");

    const existing = wishlist.find((item) => item.id === product.id);
    setError(null);

    try {
      if (existing) {
        await axios.delete(`http://localhost:3001/wishlist/${existing.dbId}`);
        const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
        setWishlist(updatedWishlist);
        syncWithLocalStorage(updatedWishlist);
      } else {
        const newItem = {
          ...product,
          userId: user.id,
          productId: product.id,
        };

        const res = await axios.post("http://localhost:3001/wishlist", newItem);
        const updatedWishlist = [
          ...wishlist,
          {
            ...product,
            dbId: res.data.id,
            id: product.id,
          }
        ];
        setWishlist(updatedWishlist);
        syncWithLocalStorage(updatedWishlist);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setError("Failed to update wishlist");
      
      const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
      if (existing) {
        const updated = localWishlist.filter(item => item.id !== product.id);
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
        setWishlist(updated);
      } else {
        const newItem = { ...product, userId: user.id, id: product.id };
        const updated = [...localWishlist, newItem];
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
        setWishlist(updated);
      }
    }
  };

  const removeFromWishlist = async (product) => {
    setError(null);

    try {
      if (product.dbId) {
        await axios.delete(`http://localhost:3001/wishlist/${product.dbId}`);
      } 
      else {
        await axios.delete(`http://localhost:3001/wishlist/${product.id}`);
      }

      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      setWishlist(updatedWishlist);
      syncWithLocalStorage(updatedWishlist);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setError("Failed to remove item");
      
      const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
      const updated = localWishlist.filter(item => item.id !== product.id);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
      setWishlist(updated);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    if (user?.id) {
      localStorage.removeItem(`wishlist_${user.id}`);
    }
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        addToWishlist, 
        removeFromWishlist, 
        // clearWishlist,
        loading,
        error
      }}
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

//changed