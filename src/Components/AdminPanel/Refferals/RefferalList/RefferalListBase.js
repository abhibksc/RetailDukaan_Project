import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Rf_Listing from "./Rf_Listing";


const RefferalListBase = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Merchanttoken = localStorage.getItem("Merchanttoken");

  return (
    <div className="">


      {/* Main content area */}
      <div className=" ">
        <Routes>
        <Route path={`/`} element={<Rf_Listing />} />
        </Routes>



      </div>
    </div>
  );
};

export default RefferalListBase;
