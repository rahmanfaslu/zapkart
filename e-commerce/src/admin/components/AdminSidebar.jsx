// src/admin/components/AdminSidebar.jsx
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin/dashboard" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/admin/products" className="block hover:text-blue-400">Manage Products</Link>
        <Link to="/admin/users" className="block hover:text-blue-400">Manage Users</Link>
        <Link to="/admin/orders" className="block hover:text-blue-400">Manage Orders</Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
