import { log } from "tone/build/esm/core/util/Debug";
import {
  CancelledItemSubmission,
  DecreaseOrderItemQuantity,
} from "../../../CrudOperations/PostOperation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ItemModal = ({ close, ItemsData, submission }) => {
  const {
    item: Itemslist,
    orderId: orderId,
    cancellation_status: cancellation_status,
  } = ItemsData || {};

  console.log(Itemslist);
  log(orderId);

  const handleAcceptClick = async (id) => {
    // Check if the cancellation_status is not 'Approved'
    if (cancellation_status !== "Approved") {
      return toast.warn(
        "You are trying to accept without approving the request!!!"
      );
    }

    try {
      // Call the CancelledItemSubmission function with the id
      const response = await CancelledItemSubmission(id);

      // If the response is successful, trigger the submission
      if (response.data.message === "Item successfully stored back in stock") {
        toast.success(response.data.message);
        submission();
      }
    } catch (error) {
      // Handle any potential errors during the API call
      console.error("Error during cancellation submission:", error);
      toast.error("Something went wrong while processing the request.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      onClick={close}
    >
      <div
        className="bg-gradient-to-br from-green-100 to-white p-6 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-green-800 text-center">
          Items List
        </h2>
        {/* Items List Container with Scroll */}
        {Itemslist && Itemslist.length > 0 ? (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
            {Itemslist.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md"
              >
                {console.log(item)}
                {/* Item Image */}
                <img
                  src={item.image}
                  alt={item.ItemName}
                  className="w-20 h-20 object-cover rounded-md shadow"
                />

                <div className="flex justify-between w-full">
                  {console.log(item)}

                  <div className="text-right">
                    <div className="flex gap-2">
                      <p className="text-sm text-gray-500">Total Price:</p>
                      <p className=" font-medium text-gray-800">
                        {/* ₹{item.total_price} */}₹{"102"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-sm text-gray-500">Discount:</p>
                      <p className=" font-medium text-gray-800">
                        ₹{"10"}
                        {/* ₹{item.totalDiscount} */}
                      </p>
                    </div>
                  </div>

                  {/* <div className="font-semibold mt-5">
                    {item.Status}
                </div> */}

                  <div className="mt-5 ">
                    {/* Debugging to check the exact value */}
                    {item.Status != "returned" &&
                      item.Status != "return rejected" && (
                        <div
                          className={`flex space-x-10 ${
                            cancellation_status !== "Approved" &&
                            "cursor-not-allowed"
                          }`}
                        >
                          <button
                            className={`p-2  shadow-lg rounded-sm text-green-500 border hover:text-green-700 hover:shadow-md hover:rounded-md ${
                              cancellation_status !== "Approved" &&
                              "cursor-not-allowed"
                            } `}
                            onClick={() =>
                              handleAcceptClick(item.ItemCancellationID)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>

                          <button
                            className={`text-red-500 p-2 rounded-sm shadow-lg ${
                              cancellation_status !== "Approved" &&
                              "cursor-not-allowed"
                            } hover:text-red-700 hover:shadow-md hover:rounded-md`}
                            // onClick={() =>
                            // cancellation_status === 'Approved' &&   handle_Reject_Click(item.order_id)
                            // }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    {item.Status == "returned" && (
                      <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white cursor-not-allowed bg-green-400">
                        Returned
                      </div>
                    )}
                    {item.Status == "return rejected" && (
                      <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white bg-red-400">
                        Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-center">No items found.</p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={close}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md w-full md:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const CancelItemConfirmation = ({
  close,
  orderId,
  ItemDataa,
  submission,
}) => {
  console.log(ItemDataa.approved_quantity);

  const [decreasingQuantity, setDecreasingQuantity] = useState(
    ItemDataa.approved_quantity
  );
  const [check, setCheck] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState(""); // State for custom reason input
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const reasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Item is delayed",
    "Delivery time doesn’t suit me",
    "Found a better price elsewhere",
    "No longer need this product",
    "Other",
  ];

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const decreaseQuantity = async (orderItemId) => {
    const login = localStorage.getItem("token");
    if (!login) {
      toast.warn("User not logged in");
      return;
    }

    const currentQuantity = ItemDataa.quantity;
    if (decreasingQuantity <= 0) {
      toast.error("Cannot decrease quantity below 0.");
      return;
    }

    const newQuantity = decreasingQuantity - 1;
    console.log(newQuantity);

    setDecreasingQuantity(newQuantity); // Amount decreased
    toast.info(`Quantity decreased to ${newQuantity}`);
  };

  const IncreaseQuantity = async (orderItemId) => {
    const login = localStorage.getItem("token");
    if (!login) {
      toast.warn("User not logged in");
      return;
    }

    const currentQuantity = ItemDataa.quantity;
    const newQuantity = decreasingQuantity + 1;

    if (newQuantity > ItemDataa.approved_quantity) {
      toast.warn("You Cannot Increses more then actual quantity");
      return;
    }

    setDecreasingQuantity(newQuantity); // Amount decreased
    toast.info(`Quantity Increased to ${newQuantity}`);
  };

  const handleConfirm = async () => {
    if (!check) {
      toast.error("Please confirm the checkbox before proceeding.");
      return;
    }

    const toDecreaseQuantity = ItemDataa.approved_quantity - decreasingQuantity;
    console.log(toDecreaseQuantity);

    if (toDecreaseQuantity === 0) {
      toast.error("toDecreaseQuantity Quantity is 0 , it must me more than 0");
      return;
    }

    let reason = selectedReason || customReason;

    if (customReason) {
      reason = customReason;
    } else {
      reason = selectedReason;
    }

    if (!reason) {
      toast.warn("Select any Reason!!");
      return;
    }

    const message = `DECREASE QUANTITY BY ${toDecreaseQuantity}`;
    console.log(message);

    const cancellation_type = "Item";

    console.log(toDecreaseQuantity);

    const response = await DecreaseOrderItemQuantity(
      cancellation_type,
      reason,
      message,
      toDecreaseQuantity,
      ItemDataa.Order_itemId
    );
    console.log(response);

    if (
      response &&
      response.data.message === "cancellation successfully processed"


    ) {
      toast.success(response.data.message);

      navigate("/");
    }
    else if (response && response.data.message == "Order cancelled and refund initiated"){

      toast.success(response.data.message);

      navigate("/");



      } 
    
    
    else if (response && response.data.error) {
      toast.error(response.data.error);
      close();
    } else if (response && response.data.message) {
      toast.error(response.data.message);
      close();
    } else {
      toast.error("Something Went Wrong!!!");
      close();
    }
  };

  const handleSelectReason = (e) => {
    setSelectedReason(e.target.value);
    if (e.target.value !== "Other") {
      setCustomReason(""); // Reset custom reason if another reason is selected
    }
  };
  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <div    
    className="fixed z-50 inset-0 flex items-end justify-center xl:items-center bg-black bg-opacity-50"
    
    >
      <div
         className="  bg-gradient-to-br from-green-100 to-white p-6 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >



        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 mt-3  border-b-[1px] text-green-800 text-center">
          Decrease Quantity
        </h2>

        {/* Items List Container */}
        {ItemDataa ? (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
              {/* Item Image */}
              <img
                src={ItemDataa.image}
                alt={ItemDataa.ItemName}
                className={`  ${
                  windowWidth < 200
                    ? "w-10 h-10 "
                    : windowWidth < 300
                    ? "w-8 h-8"
                    : windowWidth < 400
                    ? "w-9 h-9"
                    : windowWidth < 500
                    ? "w-10 h-10"
                    : windowWidth < 600
                    ? "w-12 h-12"
                    : windowWidth < 700
                    ? "w-12 h-12"
                    : windowWidth < 800
                    ? "w-14 h-14"
                    : windowWidth < 900
                    ? "w-15 h-15"
                    : windowWidth < 1000
                    ? "w-16 h-16"
                    : ""
                }  rounded-sm `}
              />

              {/* Item Details */}
              <div className="flex flex-col flex-1">
                <p
                  className={`${
                    windowWidth < 200
                      ? "text-[6px]"
                      : windowWidth < 300
                      ? "text-[11px]"
                      : windowWidth < 400
                      ? "text-[12px]"
                      : windowWidth < 500
                      ? "text-[13px]"
                      : windowWidth < 600
                      ? "text-[14px]"
                      : " "
                  }    font-semibold text-gray-700`}
                >
                  {" "}
                  {truncateText(ItemDataa.ItemName, 2)}
                </p>
                <p
                  className={`${
                    windowWidth < 200
                      ? "text-[5px]"
                      : windowWidth < 300
                      ? "text-[9px]"
                      : windowWidth < 400
                      ? "text-[10px]"
                      : windowWidth < 500
                      ? "text-[11px]"
                      : windowWidth < 600
                      ? "text-[12px]"
                      : " "
                  }    font-semibold text-gray-700`}
                >
                  Status: {ItemDataa.status}
                </p>
                <div className="flex gap-2 mt-2">
                  <p
                    className={`${
                      windowWidth < 200
                        ? "text-[5px]"
                        : windowWidth < 300
                        ? "text-[9px]"
                        : windowWidth < 400
                        ? "text-[10px]"
                        : windowWidth < 500
                        ? "text-[11px]"
                        : windowWidth < 600
                        ? "text-[12px]"
                        : " "
                    }    font-semibold text-gray-700`}
                  >
                    Total Price:
                  </p>
                  <p
                    className={`${
                      windowWidth < 200
                        ? "text-[6px]"
                        : windowWidth < 300
                        ? "text-[10px]"
                        : windowWidth < 400
                        ? "text-[12px]"
                        : windowWidth < 500
                        ? "text-[13px]"
                        : windowWidth < 600
                        ? "text-[14px]"
                        : " "
                    }     font-semibold text-green-500`}
                  >
                    ₹{ItemDataa.total_price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p
                    className={`${
                      windowWidth < 200
                        ? "text-[5px]"
                        : windowWidth < 300
                        ? "text-[9px]"
                        : windowWidth < 400
                        ? "text-[10px]"
                        : windowWidth < 500
                        ? "text-[11px]"
                        : windowWidth < 600
                        ? "text-[12px]"
                        : " "
                    }    font-semibold text-gray-700`}
                  >
                    Discount:
                  </p>
                  <p
                    className={`${
                      windowWidth < 200
                        ? "text-[5px]"
                        : windowWidth < 300
                        ? "text-[9px]"
                        : windowWidth < 400
                        ? "text-[10px]"
                        : windowWidth < 500
                        ? "text-[11px]"
                        : windowWidth < 600
                        ? "text-[12px]"
                        : " "
                    }    font-semibold text-gray-700`}
                  >
                    ₹{ItemDataa.totalDiscount}
                  </p>
                </div>

                {ItemDataa.quantity != ItemDataa.approved_quantity && (
                  <div className=" text-sm text-start text-gray-900 mt-2">
                    Earlier you have been cancelled{" "}
                    {ItemDataa.quantity - ItemDataa.approved_quantity} quantity
                    *.
                  </div>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between bg-gray-200 rounded ml-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-l hover:bg-blue-600"
                  onClick={() => decreaseQuantity(ItemDataa.Order_itemId)}
                >
                  -
                </button>
                <span className="px-4">{Math.round(decreasingQuantity)}</span>
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-l hover:bg-blue-600"
                  onClick={() => IncreaseQuantity(ItemDataa.Order_itemId)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-center">No items found.</p>
        )}

        <div className="p-7 max-h-[calc(100vh-100px)] overflow-auto">
          <div className="flex flex-col gap-10">
            <div className="flex justify-between">
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="cancellationReason">
                    <span className="text-gray-950">Reason for cancellation *</span>
                  </label>
                  <select
                  
                    id="cancellationReason"
                    value={selectedReason}
                    onChange={handleSelectReason}
                    className="border w-full h-10 p-2 mt-2 rounded-md overflow-auto text-gray-800"
                    style={{
                      maxHeight: "200px", // Set max height for scrolling
                      overflowY: "auto", // Enable vertical scrolling
                    }}
                  >
                    <option className="text-gray-950" value="">Select a reason</option>
                    {reasons.map((reason, index) => (
                      <option className="text-gray-950" key={index} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show text editor if "Other" is selected */}
                {selectedReason === "Other" && (
                  <div>
                    <label htmlFor="customReason">
                      <span className="text-gray-950">Provide your reason *</span>
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
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Section */}
        {decreasingQuantity < ItemDataa.approved_quantity && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={check}
                onChange={(e) => setCheck(e.target.checked)}
                className="w-4 h-4"
              />
              <p className="text-gray-900">
                Are you sure you want to decrease the quantity by{" "}
                {ItemDataa.approved_quantity - decreasingQuantity}?
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow-md w-full md:w-auto"
          >
            Confirm
          </button>
          <button
            onClick={close}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition shadow-md w-full md:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
