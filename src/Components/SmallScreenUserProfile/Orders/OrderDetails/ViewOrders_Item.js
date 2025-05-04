import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../../CrudOperations/GetOperation";
import { useParams } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { CancelItemConfirmation } from "../../../AdminPanel/Orders/Manage Cancel Order/CancelModal";

const ViewOrders_Item = ({ order_status, orderItems, onclose }) => {
  const { orderId } = useParams();
  const [cancelItemModal, setCancelItemModal] = useState(false);
  const [ItemData, setItemData] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCancelItemClick = (item) => {
    setItemData(item);
    setCancelItemModal(!cancelItemModal);
  };
  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <div className="fixed z-50 inset-0 flex items-end justify-center bg-black bg-opacity-50">
      <div
        className="w-full  text-white max-w-2xl max-h-[80vh]  bg-white  rounded-t-lg shadow-lg relative overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
            <button
              className="text-gray-600 hover:text-gray-900 text-lg"
              onClick={onclose}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mt-2">
            {orderItems.length > 0 &&
              orderItems.map(
                (item, index) =>
                  item.approved_quantity > 0 && (
                    <div
                      key={index}
                      className="border  rounded-md flex  justify-between px-2 items-"
                    >
                      {/* Left: Item Image & Details */}
                      <div className="flex gap-4 p-1 items-center">

                        <img
                          src={item.image}
                          alt={item.ItemName}
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
                        <div>
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
                            {truncateText(item.ItemName, 2)}
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
                            Approved {item.approved_quantity} Quantity
                          </p>
                          <p
                            className={`${
                              windowWidth < 200
                                ? "text-[4px]"
                                : windowWidth < 300
                                ? "text-[8px]"
                                : windowWidth < 400
                                ? "text-[9px]"
                                : windowWidth < 500
                                ? "text-[10px]"
                                : windowWidth < 600
                                ? "text-[11px]"
                                : " "
                            }      font-semibold text-gray-700`}
                          >
                            {item.Status}
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
                            ₹{item.total_price}
                          </p>
                        </div>


                      </div>

                      {/* Right: Cancel Button */}
                      <button
                        onClick={() =>
                          order_status.order_status === "received" &&
                          item.approved_quantity > 0
                            ? handleCancelItemClick(item)
                            : null
                        }
                        className={` 
                          
                          ${
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
                          }
                          
                          
                          flex items-center p-2 text-blue-500 font-bold hover:underline ${
                            order_status.order_status === "received" &&
                            item.approved_quantity > 0
                              ? "text-blue-500"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        disabled={
                          !(
                            order_status.order_status === "received" &&
                            item.approved_quantity > 0
                          )
                        }
                      >
                        <MdCancel size={20} />
                        {order_status.order_status === "received" &&
                        item.approved_quantity > 0
                          ? "Cancel"
                          : order_status.order_status === "processed"
                          ? "Chat us"
                          : order_status.order_status === "completed"
                          ? "Delivered"
                          : "Cancelled"}
                      </button>
                    </div>
                  )
              )}
          </div>
        </div>

        {cancelItemModal && (
          <CancelItemConfirmation
            close={handleCancelItemClick}
            orderId={orderId}
            ItemDataa={ItemData}
          />
        )}
      </div>
    </div>
  );
};

export default ViewOrders_Item;
