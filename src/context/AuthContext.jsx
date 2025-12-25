import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

axios.defaults.withCredentials = true;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchCurrent = async () => {
      if (user) return; // already have user from localStorage
      try {
        const res = await axios.get("http://localhost:5000/api/users/me");
        const apiUser = res.data;
        const normalizedUser = { ...apiUser, _id: apiUser._id || apiUser.id };
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch (err) {
        // no active session or not authenticated; clear stored user to avoid stale state
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    fetchCurrent();
  }, []);

  /* LOGIN */
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );
      const apiUser = res.data?.user || res.data;
      const normalizedUser = { ...apiUser, _id: apiUser.id || apiUser._id };
      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };



  /* LOGOUT */
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
