import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ManageRefferal_Configuration from "./ManageRefferal_Configuration";
import RefferalListBase from "./RefferalList/RefferalListBase";
import RefferalMileStoneListBase from "./ReferralMilstoneList/RefferalMileStoneListBase";
import MileStoneRequestBasePage from "./UserRequest/MilestoneRequest/MileStoneRequestBasePage";

const RefferalsRouting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Merchanttoken = localStorage.getItem("Merchanttoken");

  return (
    <div className="relative xl:flex h-screen">


      {/* Main content area */}
      <div className="flex-1 ml-0 xl:ml-6 overflow-y-auto ">
        <Routes>
        <Route path={`/`} element={<ManageRefferal_Configuration />} />
        <Route path={`/all-refferals-singUp-offers/*`} element={<RefferalListBase />} />
         <Route path={`/all-refferals-milestone/*`} element={<RefferalMileStoneListBase />} />

        <Route path={`/milestone-request`} element={<MileStoneRequestBasePage />} />
           <Route path={`/signup-offer-request`} element={<ManageRefferal_Configuration />} />
            <Route path={`/withdrawal-request`} element={<ManageRefferal_Configuration />} />
        </Routes>



      </div>
    </div>
  );
};

export default RefferalsRouting;
