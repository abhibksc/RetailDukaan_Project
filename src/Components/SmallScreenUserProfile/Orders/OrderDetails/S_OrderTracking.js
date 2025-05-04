import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import * as dayjs from "dayjs"; // Force import
import isTomorrow from "dayjs/plugin/isTomorrow";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const S_OrderTracking = ({ order_track_data }) => {
  const { trackDetail, itemDetail } = order_track_data;

  // Extract images
  const images =
    itemDetail.length > 0 ? itemDetail.map((element) => element.image) : [];

  // Helper function to format date as "Today" or "Tomorrow"
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle missing dates
    const date = dayjs(dateString);
    if (date.isToday()) return "Today";
    if (date.isTomorrow()) return "Tomorrow";
    return date.format("DD MMM YYYY"); // Default format
  };

  // Define steps dynamically
  const steps = [
    {
      label: "Order Placed",
      date: formatDate(trackDetail.order_recived_date),
      message: trackDetail.order_recived_message,
      status: trackDetail.order_recived,
    },
    {
      label: "Order Confirmed",
      date: formatDate(trackDetail.order_confirm_date),
      message: trackDetail.order_confirm_message,
      status: trackDetail.order_confirm,
    },
    {
      label: "Processed",
      date: formatDate(trackDetail.shipped_date),
      message: trackDetail.shipped_message,
      status: trackDetail.Shipped,
    },
    {
      label: "Out for Delivery",
      date: formatDate(trackDetail.out_for_delivery_date),
      message: trackDetail.out_for_delivery_message,
      status: trackDetail.out_for_delivery,
    },
    {
      label: "Delivered",
      date: formatDate(trackDetail.delivered_date),
      message: trackDetail.delivered_message,
      status: trackDetail.delivered,
    },
  ];

  // Only add "Cancelled" if it's true
  if (trackDetail.cancelled) {
    steps.push({
      label: "Cancelled",
      date: formatDate(trackDetail.cancelled_date),
      message: trackDetail.cancelled_message,
      status: trackDetail.cancelled,
    });
  }

  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const completed = steps.filter((step) => step.status).length;
    setCompletedSteps(completed);
  }, [steps]);

  const isCancelled = () =>
    steps.some((step) => step.label === "Cancelled" && step.status === 1);

  // Set the height dynamically to cover only up to the last step label
  const stepSpacing = 50; // Adjust this value for better spacing
  const totalHeight = stepSpacing * (steps.length - 1); // Total height should match last label

  const ProgressBar = styled(Box)(({ theme, progress }) => ({
    position: "absolute",
    top: 0,
    width: "2px",
    backgroundColor: progress.isCancelled
      ? theme.palette.error.main
      : theme.palette.success.main,
    transition: "height 0.5s ease",
    height: `${progress.height}px`,
    borderRadius: "4px",
  }));
  
  const BlinkingBowlWithWave = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: "-2px",
    left: "-4px",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    backgroundColor: theme.palette.success.main,
    animation: "bowlPulse 1.5s infinite ease-in-out",
  
    "&::after": {
      content: '""',
      position: "absolute",
      width: "11px",
      height: "11px",
      left: "-2px",
      top: "-2px",
      borderRadius: "50%",
      backgroundColor: theme.palette.success.light,
      opacity: 0.5,
      animation: "wavePulse 1.5s infinite ease-in-out",
    },
  
    "@keyframes bowlPulse": {
      "0%": { transform: "scale(0.3)", opacity: 1 },
      "50%": { transform: "scale(1.1)", opacity: 0.8 },
      "100%": { transform: "scale(0.8)", opacity: 1 },
    },
  
    "@keyframes wavePulse": {
      "0%": { transform: "scale(1)", opacity: 0.5 },
      "50%": { transform: "scale(1.5)", opacity: 0.2 },
      "100%": { transform: "scale(1)", opacity: 0.5 },
    },
  }));
  
  

  return (
    <div className="mt-3 bg-white px-5 py-3  shadow-sm border-b-[1px] flex gap-10">
      {/* Order Progress */}
      <div>
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          minHeight={`${totalHeight}px`}
        >
          {/* Background Line (Extends Only Up to Last Label) */}
          <Box
            position="absolute"
            top="10px"
            width="2px"
            height={`${totalHeight}px`}
            backgroundColor="#f5f5f5"
            borderRadius="4px"
          />

          {/* Moving Progress Line */}
          <ProgressBar
  progress={{
    isCancelled: isCancelled(),
    height:
      completedSteps > 0 ? (completedSteps / steps.length) * totalHeight : 0,
  }}
>
  {completedSteps > 0 && <BlinkingBowlWithWave />}
</ProgressBar>

          {/* Steps */}
          {steps.map((step, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="flex-start"
              position="relative"
              mb={3}
            >
              {/* Step Indicator */}
              <Box
                sx={{
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  backgroundColor:
                    step.status === 1
                      ? step.label === "Cancelled"
                        ? "error.main"
                        : "success.main"
                      : "white",
                  border: step.status === 1 ? "none" : "1.5px solid gray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  position: "relative",
                  left: "-7px",
                }}
              >
                {step.status === 1 && step.label === "Cancelled" ? (
                  <Typography variant="caption" fontWeight="bold">
                    X
                  </Typography>
                ) : (
                  step.status === 1 && (
                    <Typography variant="caption" fontWeight="bold">
                      ✓
                    </Typography>
                  )
                )}
              </Box>

              {/* Step Details */}
              <Box ml={2} display="flex" flexDirection="column">
                {/* Step Label */}
                <Typography variant="caption">
                {step.label} {step.date &&  "," + step.date  || " "}
                </Typography>

                {/* Step Date */}
                <Typography variant="caption" color="textSecondary">
                  {step.message || " "}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default S_OrderTracking;
