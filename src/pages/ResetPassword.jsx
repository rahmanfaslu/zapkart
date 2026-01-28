import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    const verified = localStorage.getItem("resetVerified");
    if (!email || !verified) navigate("/forgot-password");
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const email = localStorage.getItem("resetEmail");

      await api.post("/api/auth/reset-password", {
        email,
        password
      });

      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetVerified");

      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-left">
        <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">Set a new password for your account.</p>

        <form onSubmit={handleReset} className="space-y-4" aria-label="Reset password form">
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">New Password</label>
            <input
              id="password"
              type="password"
              className="w-full border p-2 rounded mb-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block mb-2 font-medium">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              className="w-full border p-2 rounded mb-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              aria-required="true"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
            aria-busy={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
