import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MenuIcon } from '@heroicons/react/outline';
import Sidebar from './Sidebar';
import Dashboard from './AdminManagement';
import AdminManagement from './AdminManagement';
import HomeManagement from './HomeManagement';
// import Dashboard from './Dashboard';


const SuperAdminRoute = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const superadmintoken = localStorage.getItem('superadmintoken');

  return (
    <div className="relative xl:flex h-screen">
      {/* Menu Icon for small screens */}
      <div className="xl:hidden p-4">
        {/* <MenuIcon
          className="h-6 w-6 text-black cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        /> */}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed z-10 top-0 left-0 h-screen bg-gray-800 text-white transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } xl:relative xl:translate-x-0 xl:w-64 xl:block`}
      >
        <Sidebar />
      </div>

      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 ml-0 xl:ml-6 overflow-y-auto p-4">
        <Routes>
          <Route path={`${superadmintoken}/`} element={<AdminManagement/>} />
          <Route path={`${superadmintoken}/adminmanagement`} element={<AdminManagement />} />

          <Route path={`${superadmintoken}/homemanagement`} element={<HomeManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default SuperAdminRoute;
