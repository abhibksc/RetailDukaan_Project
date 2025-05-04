import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOrderDetail } from "../../../CrudOperations/GetOperation";
import LoadingModal from "../../../LoadingModal";
import { OrderCancelByCustomer } from "../../../CrudOperations/PostOperation";
import { log } from "tone/build/esm/core/util/Debug";
import { toast } from "react-toastify";

const CancelOrder = () => {
  const location = useLocation();

  // Access the state
  const { orderId, OrderItemId } = location.state || {};

  console.log(orderId);
  console.log(OrderItemId);

  const navigate = useNavigate();

  const [delivery_Addresss, setDeliveryAddress] = useState("");
  const [trackItem, setTrackItem] = useState({
    itemDetail: "",
    BillDetail: "",
    trackDetail: "",
  });
  const [OrderItemsData, setOrderItems] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState(""); // State for custom reason input
  const [selectedItems, setSelectedItems] = useState([]);

  const reasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Item is delayed",
    "Delivery time doesn’t suit me",
    "Found a better price elsewhere",
    "No longer need this product",
    "Other",
  ];

  const handleSelectReason = (e) => {
    setSelectedReason(e.target.value);
    if (e.target.value !== "Other") {
      setCustomReason(""); // Reset custom reason if another reason is selected
    }
  };

  const handleConfirm = async () => {
    if (!selectedReason) {
      alert("Please select a reason for cancellation.");
      return;
    }
    if (selectedReason === "Other" && !customReason.trim()) {
      alert("Please provide a reason in the text box.");
      return;
    }

    const response = await OrderCancelByCustomer({
      message: "Order",
      orderId,
      OrderItemId,
      reason: customReason || selectedReason,
    });

    if (response && response.data.message === "Order cancellation successfully processed" ) {
      toast.success(response.data.message);
      navigate("/")
    }
    else if (response && response.data.message === "Order cancelled and refund initiated" ) {
      toast.success(response.data.message);
      navigate("/")
    }
    else  if (response && response.data.error ) {
      toast.error(response.data.error);

    }
    else if (response && response.data.message) {
      toast.error(response.data.message);

    }
    else{
      toast.error("Something Went Wrong!!!");
    }

    const finalReason =
      selectedReason === "Other" ? customReason : selectedReason;
    alert(`Cancellation confirmed for reason: ${finalReason}`);
  };

  useEffect(() => {
    setLoading(true);

    const fetchOrderDetails = async () => {
      if (orderId) {
        const response = await getOrderDetail(orderId);

        if (
          response &&
          response.data.message ===
            `All ${orderId} Order Details Retrieved Successfully!!`
        ) {
          const orderDetails = response.data.orders;

          setDeliveryAddress(orderDetails.Customer.delivery_address);
          setTrackItem({
            itemDetail: orderDetails.Items,
            BillDetail: orderDetails.Total_Bill,
            trackDetail: orderDetails.order_track,
          });

          setOrderItems(orderDetails.Items);
        }
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  return loading ? (
    <div className="min-h-screen">
      <LoadingModal />
    </div>
  ) : (
    <div className="mt-6 min-h-screen mx-20">
      <div className="shadow-md">
        <div className="bg-white rounded shadow-md mb-4">
          <div className="flex gap-2 bg-blue-500 text-white py-3 px-2">
            <span className="border px-1 self-center bg-white text-blue-700 mx-2 rounded-md font-inter font-semibold text-[13px]">
              1
            </span>
            <span className="font-inter font-semibold">EASY CANCELLATION</span>
          </div>

          <div className="p-7">
            <div className="flex flex-col gap-10">
              <div className="flex justify-between">
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="cancellationReason">
                      <span>Reason for cancellation *</span>
                    </label>
                    <select
                      id="cancellationReason"
                      value={selectedReason}
                      onChange={handleSelectReason}
                      className="border w-full h-10 p-2 mt-2 rounded-md"
                    >
                      <option value="">Select a reason</option>
                      {reasons.map((reason, index) => (
                        <option key={index} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Show text editor if "Other" is selected */}
                  {selectedReason === "Other" && (
                    <div>
                      <label htmlFor="customReason">
                        <span>Provide your reason *</span>
                      </label>
                      <textarea
                        id="customReason"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="border w-full h-20 p-2 mt-2 rounded-md"
                        placeholder="Write your reason here..."
                      />
                    </div>
                  )}

                  <div>
                    <button
                      onClick={handleConfirm}
                      className="border w-52 p-3 hover:bg-blue-600 hover:text-white rounded-md"
                    >
                      <span>Confirm Cancellation</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full mx-auto text-center">
                <span className="text-gray-500 text-[12px]">
                  You can cancel selected items for the chosen reason.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrder;
