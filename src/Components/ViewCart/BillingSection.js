import React from "react";
import { useSelector } from "react-redux";


const BillingSection = () => {
 
  
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);




  

  return (
    <div className="p-4 border  bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing Summary</h2>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Total Items:</span>
        <span>{reduxcartItems?.data?.length}</span>
      </div>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Total MRP:</span>
        <span>₹{reduxcartItems?.bill?.total_mrp || reduxcartItems?.bill?.total_mrp}</span>
      </div>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Total Discount:</span>
        <span>-₹{reduxcartItems?.bill?.total_discount}</span>
      </div>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Delivery Charges:</span>
        <span>₹{reduxcartItems?.bill?.total_delivery}</span>
      </div>
      <div className="flex justify-between border-t-2 pt-2 text-gray-800 font-semibold mb-4">
        <span>Total Amount:</span>
        <span>₹{reduxcartItems?.bill?.total_amount}</span>
      </div>
     
    </div>
  );
};

export default BillingSection;
