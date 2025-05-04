import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PaymentResponse() {
  const { userId, orderId, date } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/verify-payment/${userId}/${orderId}/${date}`,
          { method: "POST" }
        );
        const data = await response.json();
        
        if (data.status === "success") {
          navigate(`/order-success/${orderId}`);
        } else {
          navigate(`/order-failed/${orderId}`);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        navigate(`/order-failed/${orderId}`);
      }
    };

    verifyPayment();
  }, [userId, orderId, date, navigate]);

  return (
    <div className="text-center">
      <h2>Processing Payment...</h2>
    </div>
  );
}
