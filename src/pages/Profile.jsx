import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/profile", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Do not compare with any client-side stored password
    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/users/change-password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      // Show toast and force logout (server clears cookie)
      toast.success(res.data.message || "Password changed successfully!");

      // Clear client-side auth state and redirect to login
      try { await logout(); } catch (e) { /* ignore */ }
      navigate("/login");

    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating password");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xl text-red-500">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

        <div className="space-y-4 mb-6 text-gray-800">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <hr className="my-4" />

        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
