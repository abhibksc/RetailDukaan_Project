import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const RazorpayEmbedded = ({ orderId, onPaymentSuccess, onPaymentFailure }) => {
  const razorpayRef = useRef(null);

  useEffect(() => {
    console.log("Chala");
    
    if (!orderId) return;

    // Initialize Razorpay Embedded Checkout
    const razorpayInstance = new window.Razorpay({
      key: "rzp_test_pBtn3lJ6WG7wc8", // Replace with your Razorpay Key ID
      order_id: orderId,
      handler: function (response) {
        toast.success("Payment Successful!");
        onPaymentSuccess(response);
      },
      theme: {
        color: "#3399cc",
      },
    });

    // Render the embedded checkout
    razorpayInstance.open();
  }, [orderId, onPaymentSuccess, onPaymentFailure]);

  return <div ref={razorpayRef} id="razorpay-embedded-form"></div>;
};

export default RazorpayEmbedded;
