import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/users/profile")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-left">
          <h2 className="text-2xl font-semibold mb-2">My Profile</h2>
          <p className="text-sm text-gray-500 mb-6">Please login to view your profile.</p>

          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-left">
        <h2 className="text-2xl font-semibold mb-2">My Profile</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your account details.</p>

        <div className="space-y-4 mb-6 text-gray-800">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <hr className="my-6" />

        <button
          onClick={() => navigate("/forgot-password")}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
