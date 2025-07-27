// src/admin/routes/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ManageProducts from "../pages/ManageProducts";
import ManageUsers from "../pages/ManageUsers";
import ManageOrders from "../pages/ManageOrders";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/products" element={<ManageProducts />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/orders" element={<ManageOrders />} />
    </Routes>
  );
}
