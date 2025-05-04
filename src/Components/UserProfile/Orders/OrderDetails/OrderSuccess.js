import React, { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/solid"; // Heroicons for icons
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { VerifyOrderID } from "../../../CrudOperations/PostOperation";
import LoadingModal from "../../../LoadingModal";

const OrderSuccess = () => {

  const [loading, setLoading ] = useState(true);
  const navigate = useNavigate();

  const [userId_, setUserID] = useState(null);
  const [order_Id, setOrderID] = useState(null);
  const [amount_, setAmount] = useState(null);

    const location = useLocation();
   // Extract all parameters using regex
const match = location.pathname.match(/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)/);

const userId = match ? match[3] : null;
const amount = match ? match[4] : null;
const orderId = match ? match[5] : null;

// return redirect()->to("{$baseUIurl}/CheckOut/PaymentStatus-Check/userId={$userID}/orderId={$razropayOrderId}/paymentId={$razorpayPaymentId}/signature={$razorpaySignature}/amount={$amount}");



useEffect(() => {


  // Final check for confirmation payment

  const fun = async () => {
    console.log(orderId);

    const str = orderId;
    const result = str.split("-")[1];
    console.log(result); 

          // Remove prefixes
          const CleanuserId = userId.replace("userId-", "");
          const Cleanamount = amount.replace("amount-", "");
          const CleanorderId = orderId.replace("orderId-", "");
  
          console.log(CleanuserId );
          console.log(Cleanamount );
          console.log(CleanorderId );
    

    const OrderCheckResponse = await VerifyOrderID({orderId : CleanorderId});

    console.log(OrderCheckResponse);

    if(OrderCheckResponse &&   OrderCheckResponse?.status ==="Verified"){
      console.log(OrderCheckResponse);

      setUserID(CleanuserId);
      setOrderID(result);
      setAmount(Cleanamount);


      setLoading(false);

    }
    else{
      console.log("Payment Failed")
      
      navigate(`/Order/payment-fail/userId-${CleanuserId}/orderId-${CleanorderId}/${OrderCheckResponse.message}`);  
    }






   };


  fun();

  



  }, []);

  if(loading) return <LoadingModal />;
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Payment Successful!
        </h1>
        <div className="mt-4 text-gray-600 space-y-2">
          <p><strong>Order Number:</strong> {order_Id}</p>
          <p><strong>Amount:</strong> ₹{amount_}</p>
          <p className="mt-2">Thank you for shopping with us. Your order has been placed and will be processed soon.</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-lg font-semibold shadow-md transition"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate(`/Order/order-details/${order_Id}`)}
          className="mt-3 px-6 py-3 text-green-500 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold shadow-md transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
