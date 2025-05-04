// src/components/AdminPanel/AdminPanel.js
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import CartDashboard from "./CartDashboard";
import ViewCartHeader from "./ViewCartHeader";
import MobileView from "./MobileViewCart/mobileView";
import MobileHeader from "./MobileViewCart/MobileHeader";
import { getAllCartItems } from "../CrudOperations/GetOperation";
import { useDispatch, useSelector } from "react-redux";
import { importCartItems } from "../ReduxStore/Slices/cartSlice";


const viewCart = () => {










  return (
    <div className="flex flex-col ">


      <ViewCartHeader />
      <MobileHeader/>


      <div className=" mt-20 ">
        <Routes>
          <Route path="/" element={<CartDashboard />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      
        </Routes>
      </div>



    </div>
  );
};

export default viewCart;
