import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const OrderTracking = ({ order_track_data, orderId, order_status }) => {
  const { trackDetail, itemDetail, BillDetail } = order_track_data;
  console.log(itemDetail);
  
  const navigate = useNavigate();

  const images = itemDetail?.offer_items?.length > 0 ? itemDetail?.offer_items?.find((element) => element?.offer_image_path) : itemDetail?.selected_items?.length > 0 ? itemDetail?.selected_items?.find((element) => element?.image) : null;
  let Item_Length = 0;   
  
  if(itemDetail?.offer_items?.length  ||  itemDetail?.selected_items?.length){

    let offer_items_length = 0;
    let items_length = 0;



    if(itemDetail?.offer_items?.length){

offer_items_length = itemDetail?.offer_items.filter((ele) => ele.Status != "returned")?.length
console.log(offer_items_length);



    }

    if(itemDetail?.selected_items?.length){

      items_length = itemDetail?.selected_items.filter((ele) => ele.Status !== "returned")?.length
    }


    Item_Length = offer_items_length + items_length;
    

  }


  const steps = [
    { label: "Order Placed", date: trackDetail.order_recived_date, message: trackDetail.order_recived_message, status: trackDetail.order_recived },
    { label: "Order Confirmed", date: trackDetail.order_confirm_date, message: trackDetail.order_confirm_message, status: trackDetail.order_confirm },
    { label: "Processed", date: trackDetail.shipped_date, message: trackDetail.shipped_message, status: trackDetail.Shipped },
    { label: "Out for Delivery", date: trackDetail.out_for_delivery_date, message: trackDetail.out_for_delivery_message, status: trackDetail.out_for_delivery },
    { label: "Delivered", date: trackDetail.delivered_date, message: trackDetail.delivered_message, status: trackDetail.delivered },
  ];

  if (trackDetail.cancelled) {
    steps.push({ label: "Cancelled", date: trackDetail.cancelled_date, message: trackDetail.cancelled_message, status: trackDetail.cancelled });
  }
  
  if (trackDetail.refund) {
    steps.push({ label: "Refund", date: trackDetail.refund_date, message: trackDetail.refund_message, status: trackDetail.refund });
  }

  const completedSteps = steps.filter((step) => step.status).length;
  const cancelledIndex = steps.findIndex((step) => step.label === "Cancelled" && step.status === 1);

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
        <img src={images?.image || images?.offer_image_path} className="w-28 h-28" alt="Order Thumbnail" />
        <div className="flex flex-col gap-2">
          <span>{completedSteps === steps.length ? "Completed" : steps[completedSteps]?.label} ({Item_Length} items)</span>
          <span>{Item_Length} Approved</span>
          <span>₹ {Math.round(BillDetail.total_amount)}</span>
        </div>
      </div>

      {/* Order Progress */}
      <div className="w-2/4">
        <Box display="flex" flexDirection="column">
          <Box flex={1} position="relative" display="flex" flexDirection="column" alignItems="center">
            <Box top={39} width="100%" position="relative" sx={{ backgroundColor: "#f5f5f5", height: "4px", borderRadius: "4px" }}>
              <ProgressBar progress={{ isCancelled: cancelledIndex !== -1, width: cancelledIndex !== -1 ? ((cancelledIndex + 1) / steps.length) * 100 : (completedSteps / steps.length) * 100 }} />
            </Box>

            {/* Steps */}
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              {steps.map((step, index) => (
                <Box key={index} display="flex" flexDirection="column" alignItems="center" textAlign="center" width="100%">
                  <Tooltip title={step.message || "No details available"} arrow>
                    <Typography
                    
                      variant="caption"
                      fontWeight="bold"
                      color={completedSteps > index ? step.status === 0 && cancelledIndex !== -1 ? "error.main" : "success.main" : "text.secondary"}
                      mt={1}
                    >
                      {step.label}
                    </Typography>
                  </Tooltip>

                  <Box
                    sx={{
                      zIndex : 3,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: step.status === 1
                        ? step.label === "Cancelled"
                          ? "error.main"
                          : "success.main"
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
                      step.status === 1 && <Typography variant="caption" fontWeight="bold" >✓</Typography>
                    )}
                  </Box>

                  <Typography variant="caption" color="textSecondary">{step.date || "Pending"}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default OrderTracking;
