import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );

      if (res.data.length > 0) {
        const userData = res.data[0];
        
        if (userData.isBlocked) {
          toast.error("Your account has been blocked. Please contact support.");
          return false;
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const checkBlockStatus = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${userId}`);
      if (res.data.isBlocked) {
        logout();
        toast.error("Your account has been blocked. Please contact support.");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking block status:", error);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      checkBlockStatus(user.id);
      
      const interval = setInterval(() => {
        if (user?.id) checkBlockStatus(user.id);
      }, 300000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, checkBlockStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);