import React from "react";
import { CheckCircleIcon } from "@heroicons/react/solid"; // Heroicons for icons
import { useNavigate, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId, amount } = useParams(); // Get amount and orderId from the route
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Payment Successful!
        </h1>
        <div className="mt-4 text-gray-600 space-y-2">
          <p><strong>Order Number:</strong> {orderId}</p>
          <p><strong>Amount:</strong> ₹{amount}</p>
          <p className="mt-2">Thank you for shopping with us. Your order has been placed and will be processed soon.</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-lg font-semibold shadow-md transition"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate(`/Order/order-details/${orderId}`)}
          className="mt-3 px-6 py-3 text-green-500 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold shadow-md transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
