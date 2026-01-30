import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      toast.error("Session expired. Please log in again.", { id: "session-expired" });
    };

    window.addEventListener("auth:sessionExpired", handleSessionExpired);
    return () => window.removeEventListener("auth:sessionExpired", handleSessionExpired);
  }, []);

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      try {
        const res = await api.get("/api/users/me");
        const apiUser = res.data;
        const currentUser = JSON.parse(storedUser);

        const normalizedUser = {
          ...apiUser,
          _id: apiUser._id || apiUser.id,
          token: currentUser.token,
          refreshToken: currentUser.refreshToken
        };

        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch (err) {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    verifySession();
  }, []);

  /* LOGIN */
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/users/login", { email, password });
      const apiUser = res.data?.user;
      const token = res.data?.token;
      const refreshToken = res.data?.refreshToken;

      const normalizedUser = {
        ...apiUser,
        _id: apiUser?.id || apiUser?._id,
        token,
        refreshToken
      };

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
      await api.post("/api/users/logout");
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
