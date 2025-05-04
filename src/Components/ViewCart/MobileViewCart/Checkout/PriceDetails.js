import React from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";


const PriceDetails = () => {
  // Sample data for order summary and price details (replace with your actual data)
  const orderSummary = {
    totalItems: 5,
    totalPrice: "₹2,405",
    discount: "− ₹586",
    coupons: "− ₹88",
    deliveryFee: "Free",
    totalAmount: "₹1,731",
    savings: "You will save ₹683 on this order",
  };

  // Function to handle click event for the Checkout button
  const handleCheckout = () => {
    // Handle any logic before navigating to checkout, if needed
    console.log("Navigating to checkout page...");
  };

  return (
    <div className="rounded-md   bg-white px-5 py-3 border-t border-gray-300 text-center flex flex-col w-[400px]">


      <div className="border-b py-2 gap-8 items-center mb-3">
        <div className="font-semibold self-center text-gray-500">PRICE DETAILS</div>
      </div>

      <div className="flex justify-between mb-2">
        <span>Total Items</span>
        <span>{orderSummary.totalItems}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Total Price</span>
        <span>{orderSummary.totalPrice}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Product Discount</span>
        <span>{orderSummary.discount}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Coupons</span>
        <span>{orderSummary.coupons}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Delivery Fee</span>
        <span>{orderSummary.deliveryFee}</span>
      </div>



      <div className="flex justify-between mb-4 border-t-2">
        <span>Total Amount</span>
        <span>{orderSummary.totalAmount}</span>
      </div>


      <div className="text-green-600 mb-4">
        {orderSummary.savings}
      </div>

      <Link to="/" onClick={()=>toast.success("Oreder Placed")} className="bg-blue-500 text-[15px] font-inter text-white px-2 py-3 rounded-md">
          Continue to Checkout
        </Link>
     
    </div>
  );
};

export default PriceDetails;
