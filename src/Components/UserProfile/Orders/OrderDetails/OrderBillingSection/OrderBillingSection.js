import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrderBillFromDataBase } from "../../../../CrudOperations/GetOperation";
import { useParams } from "react-router-dom";

const OrderBillingSection = ({reduxcartItems , orderItems }) => {


console.log(reduxcartItems);
console.log(orderItems);


  return (
    <div className="p-4 border  bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Billing Summary
      </h2>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Total Items:</span>
        <span>{orderItems?.length}</span>
      </div>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Total MRP:</span>
        <span>₹{reduxcartItems?.total_mrp}</span>
      </div>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Total Discount:</span>
        <span>-₹{reduxcartItems?.total_discount}</span>
      </div>
      <div className="flex justify-between text-gray-700 mb-2">
        <span>Delivery Charges:</span>
        <span>₹{reduxcartItems?.total_delivery}</span>
      </div>
      <div className="flex justify-between border-t-2 pt-2 text-gray-800 font-semibold mb-4">
        <span>Total Amount:</span>
        <span>₹{reduxcartItems?.total_amount}</span>
      </div>
    </div>
  );
};

export default OrderBillingSection;
