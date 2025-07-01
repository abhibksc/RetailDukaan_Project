import { log } from "tone/build/esm/core/util/Debug";
import { AssignDelivery_Executive__, MakeFreeDeliveryExecutive, Schedule_timeDate } from "../../CrudOperations/PostOperation";
import ExpandableText from "./ExpandableText";
import { useState } from "react";
import { toast } from "react-toastify";
import React, { useEffect } from "react";
import PaginationExample from "../../PaginationExample";
import { AllDeliveryExecutive_retrive } from "../../CrudOperations/GetOperation";

export const CustomerModal = ({ close, customer }) => {
  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center"
      onClick={close}
    >
      <div
        className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-2xl max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-6 text-green-800">
          Customer Details
        </h2>

        <div className="flex flex-col  justify-between">
          <div className="flex flex-row gap-3">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Name :{" "}
            </h3>
            <p className="text-lg text-green-800">{customer.name}</p>
          </div>

          <div className="flex flex-row gap-3">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              phone :{" "}
            </h3>
            <p className="text-lg text-green-800">{customer.phone}</p>
          </div>

          <div className="flex flex-row gap-3">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              email :{" "}
            </h3>
            <p className="text-lg text-green-800">{customer.email}</p>
          </div>

          <div className="flex flex-row gap-3">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Delivery Address:
            </h3>

            <div className="text-green-800 mt-1">
              <ExpandableText
                text={`
    ${customer.delivery_address.name}, 
    ${customer.delivery_address.phone} (Alternate: ${customer.delivery_address.alternate_phone}), 
    ${customer.delivery_address.email}, 
    ${customer.delivery_address.locality}, 
    ${customer.delivery_address.City}, 
    ${customer.delivery_address.full_addresss}, 
    ${customer.delivery_address.state}, 
    PIN: ${customer.delivery_address.pin_code}, 
    Landmark: ${customer.delivery_address.landmark}, 
    Type: ${customer.delivery_address.address_type}
  `}
                limit={50}
              />
            </div>
          </div>
        </div>
        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={close}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const ScheduleModal = ({ close, scheduled, submit }) => {
  // Initial state from scheduled object, or empty strings as defaults
  const { date: initialDate, time: initialTime, id: orderId } = scheduled || {};

  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState(initialTime || "");

  // Handle input changes
  const handleDateChange = (e) => {
    console.log(e.target.value);

    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  // Handle submit and pass data to the parent component
  const handleSubmit = async () => {
    if (date && time) {
      const response = await Schedule_timeDate({ date, time, orderId });
      console.log(response);

      if (response.data.message == "Order Scheduled updated successfully!") {
        submit({ date, time });
      }
    } else {
      // Handle validation if needed (e.g., alert)
      alert("Please fill both date and time");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      onClick={close}
    >
      <div
        className="bg-gradient-to-br from-green-100 to-white p-8 rounded-xl shadow-xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-6 text-green-800 text-center">
          Scheduled Details
        </h2>

        <div className="space-y-6">
          {/* Date Input */}
          <div>
            <label
              htmlFor="delivery-date"
              className="block text-xl font-semibold text-green-900"
            >
              To Deliver Date:
            </label>
            <input
              type="date"
              id="delivery-date"
              value={date}
              onChange={handleDateChange}
              className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          {/* Time Input */}
          <div>
            <label
              htmlFor="delivery-time"
              className="block text-xl font-semibold text-green-900"
            >
              To Deliver Time:
            </label>
            <input
              type="time"
              id="delivery-time"
              value={time}
              onChange={handleTimeChange}
              className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>
        </div>

        {/* Scheduled Details */}
        {date && time && (
          <div className="bg-gray-50 p-4 rounded-lg mt-6 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800">Scheduled:</h3>

            <p className="text-md text-gray-700">
              <strong>Date:</strong> {date}
            </p>
            <p className="text-md text-gray-700">
              <strong>Time:</strong> {time}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md w-full md:w-auto"
          >
            Submit
          </button>

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

export const DeliveryExecutiveModal = ({ close, executive }) => {
  const {
    unique_order_id,
    DeliveryExecutive_details: details,
    delivery_status: delivery_status,
  } = executive || {};

  const lat = 0;
  const long = 32;

  const handleTrackClick = () => {
    if (details) {
      const token = localStorage.getItem("Merchanttoken");
      // Open a new page (tab) with the order ID or any other relevant data
      const url = `/admin/${token}/order/track/${details.last_latitude}/${details.last_longitude}`; // Example URL with dynamic order ID
      window.open(url, "_blank"); // Open the URL in a new tab
    } else {
      toast.error("Please assign the delivery executive");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      onClick={close}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          Delivery Executive Details
        </h2>

        {/* Order ID */}
        <h3 className="text-lg font-medium text-gray-700 text-center mb-6">
          Order ID:{" "}
          <span className="font-bold text-gray-900">{unique_order_id}</span>
        </h3>

        {/* Details */}
        <div className="space-y-4">
          {details ? (
            <>
              <div className="flex justify-between">
                <p className="text-gray-600">Name:</p>
                <p className="font-medium text-gray-800">{details.name}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-600">Email:</p>
                <p className="font-medium text-gray-800">{details.email}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-600">Phone:</p>
                <p className="font-medium text-gray-800">{details.phone}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-600">Address:</p>
                <p className="font-medium text-gray-800">{details.address}</p>
              </div>

              <div className="flex justify-between border-t-2 border-gray-200 pt-4">
                <p className="text-gray-600">Delivery Status</p>
                <p className="font-medium text-gray-800">
                  {delivery_status === "pending"
                    ? "Pending Pickup"
                    : delivery_status}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-700 font-medium">
              No Delivery Executive assigned yet.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full md:w-auto"
            onClick={handleTrackClick}
          >
            track
          </button>

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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ItemModal = ({ close, ItemsData, submission }) => {
  const { item: Itemslist, orderId, Total_Bill } = ItemsData || {};
  console.log(Itemslist);
  

  // State to track editable quantities
  const [editableItems, setEditableItems] = useState(
    Itemslist?.selected_items.map((item) => ({ ...item, isEditing: false })) ||  []
  );


    const [editableOfferItems, setEditableOfferItems] = useState(
    Itemslist?.offer_items.map((item) => ({ ...item, isOfferEditing: false })) ||  []
  );

  // Handle edit mode toggle
  const toggleEditMode = (item) => {
    // const updatedItems = [...editableItems];
    // updatedItems[index].isEditing = !updatedItems[index].isEditing;
    // setEditableItems(updatedItems);

    console.log(item);
    

    toast.warn("Functionality Comming Soon....")
  };

  // Handle quantity change
  const handleQuantityChange = (index, value) => {
    const updatedItems = [...editableItems];
    updatedItems[index].approved_quantity = Number(value);
    setEditableItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Updated Items:", editableItems);
    submission();
  };




 return (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={close}
  >
    <div
      className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700 border-b pb-3">
        🛒 Order Summary
      </h2>

      {/* Items Table */}
      {editableItems?.selected_items?.length > 0 ? (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🧾 Cart Items
          </h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-sm lg:text-base">
              <thead className="bg-green-100 sticky top-0 z-10">
                <tr className="text-left text-gray-800">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3 text-right">Total Price</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3 text-right">Approved Q.</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {editableItems.selected_items.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-2">
                      <img
                        src={item.image}
                        alt={item.ItemName}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2">{item.ItemName}</td>
                    <td className="px-4 py-2 text-right">₹{item.total_price}</td>
                    <td className="px-4 py-2 text-right">₹{item.totalDiscount}</td>
                    <td className="px-4 py-2 text-right">
                      {Math.round(item.quantity)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {item.isEditing ? (
                        <input
                          type="number"
                          value={item.approved_quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          className="w-16 p-1 border border-gray-300 rounded-md"
                        />
                      ) : (
                        item.approved_quantity
                      )}
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">
                      {item.Status === "delivered" && (
                        <span className="text-green-600">Delivered</span>
                      )}
                      {item.Status === "returned" && (
                        <span className="text-red-600">Returned</span>
                      )}
                      {!["delivered", "returned"].includes(item.Status) && (
                        <span className="text-orange-600">{item.Status}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => toggleEditMode(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
                      >
                        {item.isEditing ? "Save" : "Edit"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-6">No cart items found.</p>
      )}

      {/* Offer Items Table */}
      {editableOfferItems?.length > 0 ? (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🎁 Offer Items
          </h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-sm lg:text-base">
              <thead className="bg-green-100 sticky top-0 z-10">
                <tr className="text-left text-gray-800">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3 text-right">Total Price</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3 text-right">Approved Q.</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {editableOfferItems.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-2">
                      <img
                        src={item.offer_image_path}
                        alt={item.offer_name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2">{item.offer_name}</td>
                    <td className="px-4 py-2 text-right">
                      ₹{item.offer_mrp - item.offer_discount}
                    </td>
                    <td className="px-4 py-2 text-right">₹{item.offer_discount}</td>
                    <td className="px-4 py-2 text-right">
                      {Math.round(item.approved_quantity)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {item.isOfferEditing ? (
                        <input
                          type="number"
                          value={item.approved_quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          className="w-16 p-1 border border-gray-300 rounded-md"
                        />
                      ) : (
                        item.approved_quantity
                      )}
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">
                      {item.Status === "delivered" && (
                        <span className="text-green-600">Delivered</span>
                      )}
                      {item.Status === "returned" && (
                        <span className="text-red-600">Returned</span>
                      )}
                      {!["delivered", "returned"].includes(item.Status) && (
                        <span className="text-orange-600">{item.Status}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => toggleEditMode(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
                      >
                        {item.isOfferEditing ? "Save" : "Edit"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-6">No offers found.</p>
      )}

      {/* Billing Section */}
      {Total_Bill && (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            💳 Billing Summary
          </h3>
          <div className="space-y-2 text-gray-800 text-base">
            <div className="flex justify-between">
              <span>Total MRP:</span>
              <span className="font-medium">₹{Total_Bill.total_mrp}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Discount:</span>
              <span className="font-medium text-red-600">
                ₹{Total_Bill.total_discount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span className="font-medium">₹{Total_Bill.total_delivery}</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-3 text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-green-700">₹{Total_Bill.total_amount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);







};




export const PaymentModal = ({ close, setPaymentDetails }) => {
  const {
    payment_type,
    payment_status,
    refund_required,
    refund_status,
    unique_order_id,
  } = setPaymentDetails || {};

  console.log(payment_type);
  console.log(refund_required);
  console.log(refund_status);
  console.log(unique_order_id);

  const navigate = useNavigate();

  const handleOpenInNewTab = () => {
    const url = `/admin/${localStorage.getItem("Merchanttoken")}/UserPaymentDetails/${unique_order_id}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={close}
    >
      <div
        className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8 rounded-2xl shadow-2xl max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg transition duration-300"
        >
          ✕
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Payment Details</h2>
          {unique_order_id && (
            <p className="text-sm text-gray-600 mt-1">
              Order ID: {unique_order_id}
            </p>
          )}
        </div>

        {/* Payment Info */}
        <div className="space-y-4">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-blue-800 w-40">
              Payment Type:
            </h3>
            <p className="text-base text-gray-700">{payment_type || "N/A"}</p>
          </div>

          {(refund_required == 0 || refund_required == 1) && (
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-blue-800 w-40">
                Refund Required :
              </h3>
              <p
                className={`text-base font-semibold ${
                  refund_required && "text-green-600"
                }`}
              >
                {refund_required ? "Yes" : "No"}
              </p>
            </div>
          )}

          {refund_status && (
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-blue-800 w-40">
                Refund Status :
              </h3>
              <p
                className={`text-base font-semibold ${
                  refund_status && "text-green-600"
                }`}
              >
                {refund_status || "N/A"}
              </p>
            </div>
          )}

          {payment_status && (
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-blue-800 w-40">
                payment_status :
              </h3>
              <p
                className={`text-base font-semibold ${
                  payment_status === "Prepaid" ||
                  payment_status === "Refund Processed" ||
                  payment_status === "COD Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(payment_status === "Prepaid"  ||  payment_status === "COD Paid") ? "Paid" :  payment_status } 
              </p>

            </div>
          )}


            {   <div className="flex items-center">
              <h3 className="text-sm font-medium text-blue-800 w-40">
                More Details :
              </h3>
              <p
                className={`cursor-pointer font-semibold text-sm ${"text-gray-900"}`}
onClick={handleOpenInNewTab}



              >
                {"Click Here"} 
              </p>

            </div>}
          
        </div>
      </div>
    </div>
  );
};


export const MakeDeliveryBoyFreeModal = ({ close, makeDeliveryBoyData }) => {
  const [DeliveryExecutiveList, setDeliveryExecutiveList] = React.useState([]);

  const [selectedExecutive, setSelectedExecutive] = React.useState("");

  useEffect(()=>{

const fun = async () => {   


     const response = await AllDeliveryExecutive_retrive()
  
      console.log(response);
  
  
  
         if(response.data.message === 'All executive retrieved successfully!'){
  
          setDeliveryExecutiveList(response.data.data)

  
         }
      
  
  
  



}

fun();

  },[])

  const handleSubmit = async() => {
    if (selectedExecutive) {


        

        const response = await MakeFreeDeliveryExecutive(selectedExecutive);

        console.log(response);

        if(response){
            toast.success("done");
            close(); 
          
          }else{  
            toast.error("Not Done");


          }
        


    } else {
      alert("Please select a delivery executive and at least one order.");
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Make Free DeliveyExecutive</h2>
        
        <div className="mb-4">
          {/* <label className="block text-sm font-medium mb-2">Select Delivery Executive (Order : {selectedOrderIds.length})</label> */}
          <select
            className="w-full border rounded-md px-3 py-2"
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
          >
            <option value="">-- Select Executive --</option>
            {DeliveryExecutiveList.length > 0 && DeliveryExecutiveList.map((exec) => (
              <option key={exec.id} value={exec.id}>
                {exec.name}
              </option>
            ))}
          </select>
        </div>

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


// CancellationStatusModal

export const CancellationStatusModal = ({
  close,
  cancellationStatus_Details,
}) => {
  const {
    cancellation_status,
    cancellation_reasons,
    unique_order_id,
    cancellations_id,
    cancelled_on,
  } = cancellationStatus_Details || {};

  console.log(cancellation_status);
  console.log(cancellation_reasons);
  console.log(cancellations_id);
  console.log(cancelled_on);
  console.log(unique_order_id);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={close}
    >
      <div
        className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8 rounded-2xl shadow-2xl max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg transition duration-300"
        >
          ✕
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Cancellation</h2>
          {cancellations_id && (
            <p className="text-md text-gray-600 mt-1">
              Cancel ID: {cancellations_id}
            </p>
          )}
          {unique_order_id && (
            <p className="text-sm text-gray-600 mt-1">
              Order ID: {unique_order_id}
            </p>
          )}
        </div>

        {/* Payment Info */}
        <div className="space-y-4">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-blue-800 w-40">Status:</h3>
            <p
              className={`text-base font-semibold ${
                cancellation_status === "Approved"
                  ? "text-green-600"
                  : cancellation_status === "Received"
                  ? "text-orange-600"
                  : cancellation_status === "Rejected" && "text-red-600"
              }`}
            >
              {cancellation_status}
            </p>
          </div>

          {cancelled_on && (
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-blue-800 w-40">
                Cancelled On :
              </h3>
              <p className={`text-base font-semibold `}>{cancelled_on}</p>
            </div>
          )}

          {cancellation_reasons && (
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-blue-800 w-40">
                Reason :
              </h3>
              <p className={`text-base font-semibold `}>
                {cancellation_reasons}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// DeliveryStatus

export const DeliveryStatus = ({ close, status, DateOfAssign }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Number of items per page

  // Transform status data into an array of objects
  const transformedStatus = Object.entries(status).flatMap(
    ([statusKey, orders]) =>
      orders.map((orderId) => ({
        orderId,
        delivery_Status: statusKey,
      }))
  );

  // Reverse the transformed status array for display
  const reversedStatus = [...transformedStatus].reverse();

  const pageCount = Math.ceil(reversedStatus.length / itemsPerPage) || 1;

  const validCurrentPage = Math.max(0, Math.min(currentPage, pageCount - 1));

  // Determine items for the current page
  const displayedOrders = reversedStatus.slice(
    validCurrentPage * itemsPerPage,
    (validCurrentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Return "N/A" if no date is provided
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    return `${year}-${month}-${day}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={close}
    >
      <div
        className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-10 rounded-3xl shadow-xl max-w-3xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-6 right-6 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          ✕
        </button>

        {/* Title Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Delivery Status
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Here is the current status of the orders
          </p>
        </div>

        {/* Table of Order ID and Delivery Status */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg border-separate border-spacing-0">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-left">
                <th className="py-3 px-6 rounded-tl-lg">Order ID</th>
                <th className="py-3 px-6">Delivery Status</th>
                <th className="py-3 px-6 rounded-tr-lg">Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((ele, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="py-4 px-6">{ele.orderId}</td>
                  <td className="py-4 px-6">{ele.delivery_Status}</td>
                  <td className="py-4 px-6">{formatDate(DateOfAssign)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <PaginationExample
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};
