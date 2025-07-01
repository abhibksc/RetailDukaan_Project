// src/components/AdminPanel/AdminPanel.js
import { Route, Routes } from "react-router-dom";
import CartDashboard from "./CartDashboard";


const ViewCart = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
     {/* <ViewCartHeader /> */}
      {/* <MobileHeader/>  */}
      <div className=" mt-20 ">
        <Routes>
          <Route path="/" element={<CartDashboard />} />

        </Routes>
      </div>
    </div>
  );
};

export default ViewCart;
