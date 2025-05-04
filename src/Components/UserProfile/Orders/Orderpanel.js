import React from "react";
import { Routes, Route } from "react-router-dom";
import UserOrder from "./UserOrder";
import OrderDetail from "./OrderDetails/OrderDetail";
import CancelOrder from "./OrderCancellations/CancelOrder";
import OrderSuccess from "./OrderDetails/OrderSuccess";
import PaymentFailed from "./OrderDetails/PaymentFailed";

const Orderpanel = () => {
  return (
    <div className="flex">
      <div className="w-full p-4">
        <Routes>
          <Route path="/" element={<UserOrder />} />
          {/* <Route path="/orders" element={<UserOrder />} /> */}

          <Route path="order-details/:orderId" element={<OrderDetail />} />


{/* successfullyOrder */}

<Route path="successfullyOrder/*" element={<OrderSuccess />} />

<Route path="payment-fail/*" element={<PaymentFailed />} />

          <Route path="order-cancel" element={<CancelOrder />} />
        </Routes>
      </div>
    </div>
  );
};

export default Orderpanel;
