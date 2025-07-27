// src/admin/components/AdminLayout.jsx
import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom'; // ✅ Import this!

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        {/* <AdminHeader /> */}
        <main className="p-4">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
