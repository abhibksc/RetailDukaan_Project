import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ManageRefferal_Configuration from "./ManageRefferal_Configuration";
import RefferalListBase from "./RefferalList/RefferalListBase";


const RefferalsRouting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Merchanttoken = localStorage.getItem("Merchanttoken");

  return (
    <div className="relative xl:flex h-screen">


      {/* Main content area */}
      <div className="flex-1 ml-0 xl:ml-6 overflow-y-auto ">
        <Routes>
        <Route path={`/`} element={<ManageRefferal_Configuration />} />
        <Route path={`/all-refferals/*`} element={<RefferalListBase />} />
        </Routes>



      </div>
    </div>
  );
};

export default RefferalsRouting;
