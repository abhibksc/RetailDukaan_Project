import React, { useState } from "react";
// import { placeOrder, createRazorpayOrder, verifyPayment } from "../CrudOperations/PostOperation"; // API calls
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { emptyCart } from "../ReduxStore/Slices/cartSlice";
import { useNavigate } from "react-router-dom";

const CheckOutPaymentOrder = ({ isPaymentChanged, handlePaymentChange }) => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePaymentSelection = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleOrderConfirmation = async () => {
    if (selectedPayment === "COD") {
      const response = await placeOrder();
      if (response?.data?.message === "Out Of Stock") {
        toast.warn("Some Items Are Out Of Stock!");
      } else if (response?.data?.message === "Order Placed") {
        toast.success("Order Successfully Placed!");
        navigate(`/Order/successfullyOrder/${response.data.order_Id}`);
        window.location.reload();
      } else {
        toast.error(response.data.error);
      }
    } else {
      handleRazorpayPayment();
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const response = await createRazorpayOrder(); // API call to Laravel
      if (!response || !response.data) {
        toast.error("Failed to create order!");
        return;
      }

      const { amount, id: order_id, currency } = response.data;

      const options = {
        key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay Key
        amount,
        currency,
        name: "Your Ecom Store",
        description: "Complete your payment",
        order_id,
        handler: async (razorpayResponse) => {
          const verifyResponse = await verifyPayment(razorpayResponse);
          if (verifyResponse?.data?.success) {
            toast.success("Payment Successful!");
            navigate(`/Order/successfullyOrder/${verifyResponse.data.order_Id}`);
          } else {
            toast.error("Payment Verification Failed!");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      toast.error("Payment failed, try again!");
      console.error("Razorpay Error:", error);
    }
  };

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
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="COD"
                  name="payment"
                  onChange={handlePaymentSelection}
                />
                <span>Cash on Delivery (COD)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Net Banking"
                  name="payment"
                  onChange={handlePaymentSelection}
                />
                <span>Net Banking</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="UPI"
                  name="payment"
                  onChange={handlePaymentSelection}
                />
                <span>UPI</span>
              </label>

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
        <div className="bg-white p-4 rounded shadow-md flex flex-row justify-between mb-4">

          <div className="flex gap-3">

            <h1 className="border p-1 h-6 w-5 text-[13px] bg-gray-200 text-blue-500 font-bold">
              4
            </h1>

            <div className="flex flex-col gap-1">

              <span className="font-inter font-semibold text-gray-500">
                PAYMENT OPTIONS
              </span>

              <span className="font-inter text-[13px]">
                <span className="font-semibold">Credit/Debit Card</span>, UPI
              </span>
              

            </div>

          </div>

          <button onClick={handlePaymentChange} className="border px-2 text-blue-600">
            Change
          </button>
        </div>
      )}
    </>
  );
};

export default CheckOutPaymentOrder;
