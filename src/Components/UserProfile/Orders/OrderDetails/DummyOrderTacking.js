import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import GenerateImages from "./generateImages";  // Ensure this path is correct
import { log } from "tone/build/esm/core/util/Debug";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderTracking = ({ order_track_data ,orderId ,order_status }) => {
  const { trackDetail, itemDetail, BillDetail } = order_track_data;

  console.log(trackDetail);
  console.log(itemDetail);
  console.log(BillDetail);


  const navigate = useNavigate();

  log(BillDetail)

  // Extract images
  const images = itemDetail.length > 0 ? itemDetail.map((element) => element.image) : [];

  const steps = [
    { label: "Order Placed", date: trackDetail.order_recived_date, message: trackDetail.order_recived_message, status: trackDetail.order_recived },
    { label: "Order Confirmed", date: trackDetail.order_confirm_date, message: trackDetail.order_confirm_message, status: trackDetail.order_confirm },
    { label: "Processed", date: trackDetail.shipped_date, message: trackDetail.shipped_message, status: trackDetail.Shipped },
    { label: "Out for Delivery", date: trackDetail.out_for_delivery_date, message: trackDetail.out_for_delivery_message, status: trackDetail.out_for_delivery },
    { label: "Delivered", date: trackDetail.delivered_date, message: trackDetail.delivered_message, status: trackDetail.delivered },
    { label: "Cancelled", date: trackDetail.cancelled_date, message: trackDetail.cancelled_message, status: trackDetail.cancelled },
    { label: "refund", date: trackDetail.refund_date, message: trackDetail.refund_message, status: trackDetail.refund},
  ];

  const Itemstatus = () => {
    // Find the first step that is not cancelled or completed
    const nextStep = steps.find((step) => step.status === 0); // status === 0 means not completed
  
        // If canceled step is found, return cancel
        if (steps[5].status === 1) { // Cancelled step
          return "Cancelled";
        }

        // If next step exists, return the next step's label
        if (nextStep && nextStep.label === "Out for Delivery") {
          return "Item waiting for courier pickup";
        }

        if (nextStep && nextStep.label === "delivered") {
          return "Out for Delivery";
        }
    
        // If next step exists, return the next step's label
        if ( nextStep && nextStep) {
          return nextStep.label;
        }
  
    // If all steps are completed, return "Completed" or a similar message
    return "Completed";
  };
  

  const [completedSteps, setCompletedSteps] = useState(0);
  const [cancelledIndex, setCancelledIndex] = useState(null);

  useEffect(() => {
    const cancelIndex = steps.findIndex((step) => step.status === 1 && step.label === "Cancelled");
    setCancelledIndex(cancelIndex);

    const completed = steps.filter((step) => step.status).length;
    setCompletedSteps(completed);

    localStorage.setItem("orderProgress", completed);
  }, [steps]);

  const isCancelled = () => steps[5].status;


  const ProgressBar = styled(Box)(({ theme, progress }) => ({
    position: "absolute",
    left: 0,
    height: "4px",
    backgroundColor: progress.isCancelled ? theme.palette.error.main : theme.palette.success.main,
    transition: "width 0.5s ease",
    width: `${progress.width}%`,
    borderRadius: "4px",
  }));

  return (
    <div className="mt-3 bg-white px-5 py-3 rounded-md shadow-md flex gap-10">

      {/* Image Display */}

      
      <div className="flex gap-3">
        <img src={itemDetail &&  itemDetail[0].image} alt="Order Thumbnail" />
        <div className="flex flex-col gap-2">
          <span>{Itemstatus()} ({itemDetail.length} items)</span>
          <span>{itemDetail.length} Approved</span>
          <span>₹ {Math.round(BillDetail.total_amount)}</span>
        </div>
      </div>

      {/* Order Progress */}
      <div className=" w-2/4 ">
        <Box display="flex" flexDirection="column">
          <Box
            flex={1}
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Box
              top={39}
              width="100%"
              position="relative"
              sx={{
                backgroundColor: "#f5f5f5",
                height: "4px",
                borderRadius: "4px",
              }}
            >
              <ProgressBar
                progress={{
                  isCancelled: isCancelled(),
                  width: cancelledIndex !== -1
                    ? ((cancelledIndex + 1) / steps.length) * 100
                    : (completedSteps / steps.length) * 100,
                }}
              />
            </Box>

            {/* Steps */}
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              {steps.map((step, index) => (
                <Box
                  zIndex={10}
                  key={index}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  width="100%"
                >
                  <Tooltip title={step.message || "No details available"} arrow>
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      color={completedSteps > index
                        ? step.status === 0 && isCancelled()
                          ? "error.main"
                          : "success.main"
                        : "text.secondary"
                      }
                      mt={1}
                    >
                      {step.label}
                    </Typography>
                  </Tooltip>

                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: step.status === 1
                        ? step.label === "Cancelled"
                          ? "error.main"
                          : "success.main"
                        : step.status === 0 && isCancelled()
                        ? "error.main"
                        : "gray.400",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    {step.status === 1 && step.label === "Cancelled" ? (
                      <Typography variant="caption" fontWeight="bold">X</Typography>
                    ) : (
                      step.status === 1 && <Typography variant="caption" fontWeight="bold">✓</Typography>
                    )}
                  </Box>

                  <Typography variant="caption" color="textSecondary">{step.date || "Pending"}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </div>

      <div className="flex flex-col my-auto mx-auto">
        <button  className={` px-4 py-2 rounded-md 
        
        ${order_status.order_status === "received" ? "bg-blue-500 text-white " : 
        order_status.order_status === "processed" ? "bg-gray-500 text-white cursor-not-allowed" : 
        order_status.order_status === "completed" ? "bg-gray-500 text-white cursor-not-allowed" : " bg-gray-500 text-white cursor-not-allowed "}
        
        `} onClick={() => {
          
          const orderData = {
            orderId : orderId,
            OrderItemId : itemDetail.map((ele)=>ele.Order_itemId)
          }

          order_status.order_status === "received"
          ? navigate(`/order/order-cancel`, { state: orderData })
          : order_status.order_status === "processed"
          ? console.log("The order has been processed and cannot be cancelled by the customer. Please contact the seller for further assistance.")
          : order_status.order_status === "completed"
          ? console.log("The order has been completed and cannot be cancelled by the customer. Please contact the seller for further assistance.")
          : "";
        




          
          
        
        
        }
        
        }
          
          >
        

{


order_status.order_status === "received" ? 'Cancel' : order_status.order_status === "processed" ? "Chat us" : order_status.order_status === "completed" ? "Delivered" :"Cancelled"
}




        </button>
      </div>
    </div>
  );
};

export default OrderTracking;
