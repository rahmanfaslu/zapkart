import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';  

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <main className="p-4">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
