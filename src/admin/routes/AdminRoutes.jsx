import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/Dashboard";
import ManageUsers from "../pages/ManageUsers";
import ManageOrders from "../pages/ManageOrders";
import ManageProducts from "../pages/ManageProduct";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="orders" element={<ManageOrders />} />
      </Route>
    </Routes>
  );
}
