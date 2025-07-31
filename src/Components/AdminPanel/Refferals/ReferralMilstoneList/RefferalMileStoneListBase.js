import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Rf_Milestone_Listing from "./Rf_Milestone_Listing";
import ViewReferrerMileStone from "./ViewReferrerMileStone";


const RefferalMileStoneListBase = () => {

  return (
    <div className="">


      {/* Main content area */}
      <div className=" ">
        <Routes>
        <Route path={`/`} element={<Rf_Milestone_Listing />} />

                <Route path={`/milstone/:referrer_id`} element={<ViewReferrerMileStone />} />
        </Routes>



      </div>
    </div>
  );
};

export default RefferalMileStoneListBase;
