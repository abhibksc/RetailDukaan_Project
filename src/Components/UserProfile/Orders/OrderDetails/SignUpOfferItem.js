import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MdCancel } from "react-icons/md"; // Import the cancel icon
import { CancelItemConfirmation } from "../../../AdminPanel/Orders/Manage Cancel Order/CancelModal";

const SignUpOfferItem = ({ SinguPOfferItemData, order_status ,orderId}) => {
  console.log(SinguPOfferItemData);

  const [cancelItemModal, setCancelItemModal] = useState(false);
  const [ItemData, setItemData] = useState("");

  const handleCancelItemClick = (item) => {
    console.log(item);

    setItemData(item);

    setCancelItemModal(!cancelItemModal);
  };

  return (
    <div className="mt-3 bg-white px-5 py-3">
      {SinguPOfferItemData?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Offers Items</h2>
          <div className="space-y-4">
            {/* Map over the OrderItems_data and display each item */}
            {SinguPOfferItemData?.filter(
              (ele) => ele.Status !== "returned"
            ).map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-md flex justify-between items-center"
              >
                {/* Left Section: Item Image and Details */}
                <div className="flex gap-4 items-center">
                  <img
                    src={item.offer_image_path}
                    alt={item.offer_name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{item.offer_name}</p>
                    <p className="font-normal">{item.offer_description}</p>

                    <p className="text-gray-500">{item.Status}</p>

                    <div className="text-sm flex gap-2">
                      <p className="font-semibold text-gray-500 line-through">
                        ₹
                        {(
                          Number(item.total_price) + Number(item.totalDiscount)
                        ).toFixed(2)}
                      </p>

                      <p className="font-semibold text-green-600">
                        ₹{Number(item.total_price).toFixed(2)}
                      </p>

                      <p className="text-xs text-red-500 font-medium">
                        You save ₹{Number(item.totalDiscount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Quantity */}
                <div className="flex items-start  gap-2">
                  <p className="text-gray-500 whitespace-nowrap">Qty:</p>
                  <p className="font-semibold">{item.quantity}</p>
                </div>

                {/* Right Section: Cancel Button */}
                <button
                  onClick={() =>
                    order_status.order_status === "received" &&
                    item.approved_quantity > 0
                      ? handleCancelItemClick(item)
                      : order_status.order_status === "received" &&
                        item.approved_quantity < 0
                      ? " "
                      : order_status.order_status === "processed"
                      ? console.log(
                          "The order has been processed and cannot be cancelled by the customer. Please contact the seller for further assistance."
                        )
                      : order_status.order_status === "completed"
                      ? ""
                      : ""
                  }
                  className={`flex items-center p-1 gap-2 text-blue-500 font-bold 
        
                  ${
                    order_status.order_status === "received" &&
                    item.approved_quantity > 0
                      ? "text-blue-500  hover:underline "
                      : order_status.order_status === "received" &&
                        item.approved_quantity < 0
                      ? "text-gray-500  cursor-not-allowed"
                      : order_status.order_status === "processed"
                      ? "text-gray-500  cursor-not-allowed"
                      : order_status.order_status === "completed"
                      ? "text-gray-500  cursor-not-allowed"
                      : " text-gray-500  cursor-not-allowed "
                  }
                  
                  `}
                >
                  <MdCancel size={20} />

                  {order_status.order_status === "received" &&
                  item.approved_quantity > 0
                    ? "Cancel"
                    : order_status.order_status === "received" &&
                      item.approved_quantity < 0
                    ? "Cancelled"
                    : order_status.order_status === "processed"
                    ? "Chat us"
                    : order_status.order_status === "completed"
                    ? "Delivered"
                    : "Cancelled"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}



         {cancelItemModal && (
              <CancelItemConfirmation
                close={handleCancelItemClick}
                orderId={orderId}
                ItemDataa={ItemData}
              />
            )}
      


    </div>
  );
};

export default SignUpOfferItem;
