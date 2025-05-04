import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OrderCancelRequestByMerchant } from "../../CrudOperations/PostOperation";
import { getAllOrders } from "../../CrudOperations/GetOperation";

const GenerateCancelRequestModal = ({ close, cancelRequestData , handleOrderCancelSubmition}) => {
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reasonList, setReasonList] = useState([
    { id: 1, reason: "Out of stock" },
    { id: 2, reason: "Incorrect pricing" },
    { id: 3, reason: "Payment not received" },
    { id: 4, reason: "Customer requested cancellation" },
    { id: 5, reason: "Delivery address unreachable" },
    { id: 6, reason: "Technical issue in order processing" },
    { id: 7, reason: "Fraudulent activity suspected" },
    { id: 8, reason: "Damaged or unavailable items" },
    { id: 9, reason: "Other (please specify)" },
  ]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        if (response?.data?.messsage === "All Orders Retrive Successfully!!") {
          setOrderList(response.data.orders.filter((ele)=>ele.order_status.order_status !== "cancelled"));
         
        } else {
          toast.error("Failed to fetch orders.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching orders.");
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const handleSubmit = async () => {
    if (!selectedOrder) {
      toast.error("Please select an order.");
      return;
    }

    if (!selectedReason && !customReason) {
      toast.error("Please select a reason or specify a custom reason.");
      return;
    }

    if (!isConfirmed) {
      toast.error("Please confirm that you want to cancel this order.");
      return;
    }

    const reason = customReason || selectedReason;

    try {
      const response = await OrderCancelRequestByMerchant({
        message: "Order",
        orderId: selectedOrder,
        reason,
      });

      if (response?.data?.status === "success") {

        toast.success("Cancellation Request Generated!");
  
          toast.success("Order Cancelled Successfully!");
  

        handleOrderCancelSubmition();
        close();


      } else {
        toast.error("Failed to cancel the order.");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling the order.");
      console.error(error);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Generate Cancel Request</h2>

        {/* Select Order */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Order *</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="">-- Select Order --</option>
            {orderList.length > 0 &&
              orderList.map((order) => (
                <option key={order.unique_order_id} value={order.unique_order_id}>
                  {order.unique_order_id}
                </option>
              ))}
          </select>
        </div>

        {/* Select Reason */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Reason *</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setCustomReason(""); // Clear custom reason when a predefined reason is selected
            }}
          >
            <option value="">-- Select Reason --</option>
            {reasonList.length > 0 &&
              reasonList.map((reason) => (
                <option key={reason.id} value={reason.reason}>
                  {reason.reason}
                </option>
              ))}
          </select>
        </div>

        {/* Custom Reason */}
        {selectedReason === "Other (please specify)" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Specify Reason *</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter custom reason"
            />
          </div>
        )}

        {/* Confirmation Checkbox */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            Are you sure you want to cancel this order?
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateCancelRequestModal;
