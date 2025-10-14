import React, { useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xl text-red-500">
        Please login to view your profile.
      </div>
    );
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (oldPassword !== user.password) {
      setMessage("Old password is incorrect.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        password: newPassword,
      });

      const updatedUser = { ...user, password: newPassword };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("Failed to change password. Please try again.");
    }
  };

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
