import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderDetail from "./OrderDetails/S_OrderDetail";
import CancelOrder from "./OrderCancellations/CancelOrder";
import OrderSuccess from "./OrderDetails/OrderSuccess";
import S_UserOrder from "./S_UserOrder";
import S_OrderDetail from "./OrderDetails/S_OrderDetail";
import PaymentFailed from "../../UserProfile/Orders/OrderDetails/PaymentFailed";

const SOrderpanel = () => {
  return (
    <div className="h-[calc(100vh-66px)] overflow-y-auto">
      <div className="">
        <Routes>
          <Route path="/" element={<S_UserOrder  />} />
          {/* <Route path="/orders" element={<UserOrder />} /> */}

          <Route path="order-details/:orderId" element={<S_OrderDetail />} />


{/* successfullyOrder */}

          <Route path="successfullyOrder/*" element={<OrderSuccess />} />

<Route path="payment-fail/*" element={<PaymentFailed />} />


          <Route path="order-cancel" element={<CancelOrder />} />
        </Routes>
      </div>
    </div>
  );
};

export default SOrderpanel;
