import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

const OrderTracking = ({ order_track_data }) => {
  const { trackDetail } = order_track_data;

  const steps = [
    {
      label: "Order Placed",
      date: trackDetail.order_recived_date,
      message: trackDetail.order_recived_message,
      status: trackDetail.order_recived,
    },
    {
      label: "Order Confirmed",
      date: trackDetail.order_confirm_date,
      message: trackDetail.order_confirm_message,
      status: trackDetail.order_confirm,
    },
    {
      label: "Shipped",
      date: trackDetail.shipped_date,
      message: trackDetail.shipped_message,
      status: trackDetail.Shipped,
    },
    {
      label: "Out for Delivery",
      date: trackDetail.out_for_delivery_date,
      message: trackDetail.out_for_delivery_message,
      status: trackDetail.out_for_delivery,
    },
    {
      label: "Delivered",
      date: trackDetail.delivered_date,
      message: trackDetail.delivered_message,
      status: trackDetail.delivered,
    },
    {
      label: "Cancelled",
      date: trackDetail.cancelled_date,
      message: trackDetail.cancelled_message,
      status: 0,
    },
  ];

  const [completedSteps, setCompletedSteps] = useState(0);
  const [cancelledIndex, setCancelledIndex] = useState(null);

  useEffect(() => {
    const cancelIndex = steps.findIndex(
      (step) => step.status === 1 && step.label === "Cancelled"
    );
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
    backgroundColor: progress.isCancelled
      ? theme.palette.error.main
      : theme.palette.success.main,
    transition: "width 0.5s ease",
    width: `${progress.width}%`,
    borderRadius: "4px",
  }));

  return (
    <Box
      mt={3}
      p={3}
      bgcolor="white"
      borderRadius={2}
      boxShadow={3}
      display="flex"
      flexDirection="column"
      gap={4}
    >
      {/* Order Details Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid #e0e0e0"
        pb={2}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h6" fontWeight="bold">
            Order Details
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Items yet to be shipped: <strong>4</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Approved: <strong>4</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Amount: <strong>₹464</strong>
          </Typography>
        </Box>
      </Box>

      {/* Tracking Progress Bar */}
      <Box
        flex={1}
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Box
          width="100%"
          position="relative"
          sx={{ backgroundColor: "#f5f5f5", height: "4px", borderRadius: "4px" }}
        >
          <ProgressBar
            progress={{
              isCancelled: isCancelled(),
              width:
                cancelledIndex !== -1
                  ? ((cancelledIndex + 1) / steps.length) * 100
                  : (completedSteps / steps.length) * 100,
            }}
          />
        </Box>

        {/* Steps */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          {steps.map((step, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              width="100%"
            >
              <CircularProgress
                size={30}
                variant="determinate"
                value={100}
                sx={{
                  color:
                    step.status === 0 && isCancelled()
                      ? "error.main"
                      : step.status === 1 && !isCancelled()
                      ? "success.main"
                      : "gray.400",
                }}
              />
              <Tooltip title={step.message || "No details available"} arrow>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color={
                    completedSteps > index
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
              <Typography variant="caption" color="textSecondary">
                {step.date || "Pending"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderTracking;
