import React, { useEffect, useState } from "react";

const OrderTracking = ({ order_track_data }) => {
  const { trackDetail } = order_track_data; // Destructure trackDetail from props

  const steps = [
    { label: "Order Placed", date: trackDetail.order_recived_date, message: trackDetail.order_recived_message, status: trackDetail.order_recived },
    { label: "Order Confirmed", date: trackDetail.order_confirm_date, message: trackDetail.order_confirm_message, status: trackDetail.order_confirm },
    { label: "Shipped", date: trackDetail.shipped_date, message: trackDetail.shipped_message, status: trackDetail.Shipped },
    { label: "Out for Delivery", date: trackDetail.out_for_delivery_date, message: trackDetail.out_for_delivery_message, status: trackDetail.out_for_delivery },
    { label: "Delivered", date: trackDetail.delivered_date, message: trackDetail.delivered_message, status: trackDetail.delivered },
    { label: "Cancelled", date: trackDetail.cancelled_date, message: trackDetail.cancelled_message, status: 1 },
  ];

  const [completedSteps, setCompletedSteps] = useState(0);
  const [cancelledIndex, setCancelledIndex] = useState(null);

  useEffect(() => {
    // Find the index of the "Cancelled" step
    const cancelIndex = steps.findIndex((step) => step.status === 1 && step.label === "Cancelled");
    setCancelledIndex(cancelIndex);

    // Calculate completed steps dynamically
    const completed = steps.filter((step) => step.status === 1).length;
    setCompletedSteps(completed);

    // Save progress to localStorage
    localStorage.setItem("orderProgress", completed);
  }, [steps]);

  const isCancelled = () => steps[5].status === 1;

  return (
    <div className="mt-3 bg-white px-5 py-3 rounded-md shadow-md flex">
      {/* Order Summary */}
      <div className="flex gap-3">
        <img src="" alt="Order Thumbnail" />
        <div className="flex flex-col gap-2">
          <span>Items yet to be shipped (4 items)</span>
          <span>4 Approved</span>
          <span>₹464</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative flex items-center w-2/4 mx-auto">
        {/* Base Line */}
        <div className={`absolute w-full h-[3px] ${isCancelled() ? "bg-red-500" : "bg-gray-300"}`}></div>

        {/* Active Progress Line */}
        <div
          className="absolute left-0 h-[3px] bg-green-600 transition-all duration-[3000ms]"
          style={{
            width: `${(completedSteps / steps.length) * 100}%`,
            maxWidth: cancelledIndex !== -1 ? `${((cancelledIndex + 1) / steps.length) * 100}%` : "100%",
          }}
        ></div>

        {/* Step Indicators */}
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10 group w-1/5">
            {/* Tooltip */}
            {step.message && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs py-1 px-3 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {step.message}
              </div>
            )}

            {/* Step Label */}
            <p
              className={`text-[12px] lg:text-[12px] mb-2 font-bold text-center ${
                completedSteps > index
                  ? step.status === 0 && isCancelled()
                    ? "text-red-500"
                    : "text-green-500"
                  : "text-gray-300"
              }`}
            >
              {step.label}
            </p>

            {/* Status Indicator (Circle or Cross) */}
            <div
              className={`w-3 h-3 rounded-full flex items-center justify-center text-white font-bold ${
                step.status === 0 && isCancelled()
                  ? "bg-red-600"
                  : step.status === 1 && !isCancelled()
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            >
              {step.status === 0 && isCancelled() && "X"} {/* Show X if cancelled */}
            </div>

            {/* Date */}
            <p className="text-[12px] lg:text-[11px] mt-2 text-center font-bold text-gray-600">
              {step.date ? step.date : "Pending"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
