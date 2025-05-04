import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { emptyCart } from "../ReduxStore/Slices/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  InitiatePayment,
  placeOrder,
  verifyInitiatedpayment,
} from "../CrudOperations/PostOperation";
import LoadingModal from "../LoadingModal";

const CheckOutPaymentOrder = ({ isPaymentChanged, handlePaymentChange }) => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [upiMethod, setUpiMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, SetLoading] = useState(false);

  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(840);
  const billAmount = useSelector((state) => state.cartReducer.cartItems.bill);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Payment Selection
  const handlePaymentSelection = (event) => {
    setSelectedPayment(event.target.value);
    setUpiMethod(""); // Reset UPI method when changing payment mode
    setIsUpiVerified(false);
  };

  // Dummy UPI Verification
  const handleVerifyUpi = () => {
    if (upiId.includes("@")) {
      setIsUpiVerified(true);
      toast.success("UPI ID Verified Successfully!");
    } else {
      setIsUpiVerified(false);
      toast.error("Invalid UPI ID!");
    }
  };

// Razorpay Payment Handler
  
const handleOrderConfirmation = async () => {
  SetLoading(true);
  if (selectedPayment === "COD") {
    const placeOrderResponse = await placeOrder();
    console.log(placeOrderResponse);

    if (placeOrderResponse.data.message === "Order Placed") {
      toast.success("Order Successfully Placed!");
      navigate(`/Order/successfullyOrder/${placeOrderResponse.data.order_Id}`);
      window.location.reload();
    } else if (placeOrderResponse.data.message === "Out Of Stock") {
      console.log(placeOrderResponse);
      toast.warning(
        "This item is out of stock. If payment was deducted, the refund will be processed within 2-3 working days."
      );
    }
  } else {
    try {
      console.log(billAmount);

      const res = await InitiatePayment({ amount: billAmount.total_amount }); // Initiate order from backend
      if (res && res.Message) {
        toast.error(res.Message);
        SetLoading(false);
        return;
      }

      SetLoading(false);

      const order_id = res.order_id; // Get order_id from response
      if (!order_id) {
        toast.error("Failed to initiate payment!");
        return;
      }

      setTimeLeft(840); // Reset countdown timer
      let timerInterval;

      const options = {
        key: "rzp_test_pBtn3lJ6WG7wc8", // Replace with your Razorpay Key ID
        currency: "INR",
        name: "Retail Dukaan",
        description: "Order Payment",
        callback_url: `${window.location.origin}/Order/successfullyOrder/${order_id}`,  // Redirect here after payment
        image:
          "https://firebasestorage.googleapis.com/v0/b/wipenexit-48482.appspot.com/o/grocery%2Fretail_dukaan_images.png?alt=media&token=b7a79b72-4ad6-47ff-ab59-06ceaa3aa05d",
        order_id: order_id,
        handler: async function (response) {
          clearInterval(timerInterval); // Stop the timer on successful payment
          SetLoading(true);
          if (response) {
            console.log(response);
            try {
              const verifyData = await verifyInitiatedpayment({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              console.log(verifyData);

              if (verifyData.Status === "Success") {
                SetLoading(false);
                toast.success("Payment Verified Successfully!");
                navigate(`/Order/successfullyOrder/${verifyData.order_Id}`);
                // window.location.reload();
              } else {
                toast.error(verifyData.message);
              }
            } catch (error) {
              SetLoading(false);

              console.error("Error verifying payment:", error);
              toast.error("Error verifying payment!");
            }
          } else {
            SetLoading(false);

            toast.error("Payment failed!");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            clearInterval(timerInterval);
            setTimeLeft(840); // Reset countdown timer

            toast.warning("Payment window closed or session expired.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      // **Start Timer**
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            razorpay.close(); // Try closing Razorpay popup

            // Force close Razorpay popup (in case `.close()` fails)
            const razorpayPopup = document.querySelector("iframe");
            if (razorpayPopup) {
              razorpayPopup.parentNode.style.display = "none";
            }

            toast.error("Payment session expired. Please try again.");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Error in payment processing!");
    }
  }
};

if(loading) return <LoadingModal/>


  

  return (
    <>
      {isPaymentChanged ? (
        <div className="bg-white rounded shadow-md mb-4">
          <div className="flex gap-2 bg-blue-500 text-white py-3 px-2">
            <span className="border px-1 self-center bg-white text-blue-700 mx-2 rounded-md font-inter font-semibold text-[13px]">
              4
            </span>
            <span className="font-inter font-semibold">PAYMENT OPTIONS</span>
          </div>

          <div className="p-7">
            <div className="flex flex-col gap-4">
              {/* UPI PAYMENT OPTION */}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="UPI"
                  name="payment"
                  onChange={handlePaymentSelection}
                  checked={selectedPayment === "UPI"}
                />
          
          <div className="flex flex-row gap-3">
          <span>Pay</span>
          {selectedPayment !== "COD" && selectedPayment !== "" && timeLeft > 0 && (
  <div className="fixed bottom-10 right-10 bg-black text-white p-3 rounded-md text-sm font-semibold">
    Payment expires in:{" "}
    <span className="text-yellow-400">
      {`${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`}
    </span>
  </div>
)}



          </div>
              </label>

              {/* Cash on Delivery */}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="COD"
                  name="payment"
                  onChange={handlePaymentSelection}
                />
                <span>Cash on Delivery (COD)</span>
              </label>

              {/* Confirm Order Button */}
              {selectedPayment && (
                <button
                  onClick={handleOrderConfirmation}
                  className="bg-orange-500 text-white px-2 py-1 rounded-md mt-4"
                >
                  {selectedPayment === "COD" ? "Confirm Order" : "Pay Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow-md">...</div>
      )}
    </>
  );
};

export default CheckOutPaymentOrder;
