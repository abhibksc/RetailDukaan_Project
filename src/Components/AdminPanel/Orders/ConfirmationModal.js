import React, { useState } from "react";
import LoadingModal from "../../LoadingModal";

const ConfirmationModal = ({
  closeConfirmationModal,
  Orderstatus,
  confirmChangeStatus,
  assignDeliveryExecutive,
  paymentstatus,
}) => {
  const [load, setIsLoad] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message =
      (Orderstatus && { message: "OrderStatus" }) ||
      (assignDeliveryExecutive.orderId && { message: "assign_delivery_Executive"  , data : assignDeliveryExecutive}) ||
      (paymentstatus.status && { message: "payment"  , data : paymentstatus});

      console.log("message");
      
      confirmChangeStatus(message);
  };

  return (
    <div>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out">
        {/* Modal Container */}
        <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 relative transform transition-transform duration-500 hover:scale-100 bg-gradient-to-tr from-gray-50 via-white to-gray-100">
          {/* Modal Title */}
          <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
            Confirm Status Change
          </h2>

          {/* Modal Description */}
          {console.log(Orderstatus)
          }
          {Orderstatus && (
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold text-blue-600">{Orderstatus}</span>{" "}
              this order?
            </p>
          )}


{console.log(assignDeliveryExecutive)
          }

          {(assignDeliveryExecutive.name && assignDeliveryExecutive.orderId ) && (
            <p className="text-gray-600 text-center mb-6">
              Are you sure want to assign{" "}
              <span className="font-semibold text-blue-600">
                {assignDeliveryExecutive.name}
              </span>{" "}
              to deliver order ID{" "}
              <span className="font-semibold text-blue-600">
                {assignDeliveryExecutive.orderId}
              </span>
              ?
            </p>
          )}

{console.log(paymentstatus)
          }


          {paymentstatus.status && (
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to change the payment status to
              <span className="font-semibold text-blue-600"> {paymentstatus.status}</span>?
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-evenly items-center space-x-4">
            <button
              onClick={closeConfirmationModal}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-md hover:bg-gray-300 hover:shadow-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
