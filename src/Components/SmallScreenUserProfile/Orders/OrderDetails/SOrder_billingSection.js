import React from "react";
import { useSelector } from "react-redux";


const SOrder_billingSection = ({Bill}) => {
 
  
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);




  

  return (
    <div className="p-4  bg-white rounded-md shadow-md border-b-[1px]">
      <h2 className="text-md font-semibold text-gray-600 mb-4 ">Billing Detail</h2>
      <div className="flex justify-between text-gray-700 mb-2">
        <span className="text-sm">Total MRP:</span>
        <span className="text-sm">₹{Bill.total_mrp}</span>
      </div>
      <div className="flex justify-between text-gray-700 mb-2">
        <span className="text-sm">Total Discount:</span>
        <span className="text-sm">-₹{Bill.total_discount}</span>
      </div>
      <div className="flex justify-between text-gray-700 mb-2">
        <span className="text-sm">Delivery Charges:</span>
        <span className="text-sm">₹{Bill.total_delivery}</span>
      </div>
      <div className="flex justify-between border-t-2 pt-2 text-gray-800 font-semibold mb-4">
        <span>Total Amount:</span>
        <span>₹{Bill.total_amount}</span>
      </div>
     
    </div>
  );
};

export default SOrder_billingSection;
