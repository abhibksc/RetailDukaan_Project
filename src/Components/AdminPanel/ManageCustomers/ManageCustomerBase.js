import  { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ManageCustomer from "./ManageCustomer";


const ManageCustomerBase = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Merchanttoken = localStorage.getItem("Merchanttoken");

  return (
    <div className="relative xl:flex h-screen">


      {/* Main content area */}
      <div className="flex-1 ml-0 xl:ml-6 overflow-y-auto ">
        <Routes>
        <Route path={`/`} element={<ManageCustomer />} />
        </Routes>



      </div>
    </div>
  );
};

export default ManageCustomerBase;
