import React, { useEffect, useState } from "react";
import { FaListAlt, FaUpload, FaDownload, FaUserPlus } from "react-icons/fa"; // Importing icons from react-icons
import { useNavigate } from "react-router-dom";
import { VscCalendar } from "react-icons/vsc";

// import successTone from "../../../../assets/tones/success-tone.mp3"; // Import the success tone audio file

import successTone from "../../../../assets/tones/successtone.mp3";
import { toast } from "react-toastify";
import BackButton from "../../../BackButton";
import GenerateCancelRequestModal from "../GenerateCancelRequestModal";
import PaginationExample from "../../../PaginationExample";
import {
  AllDeliveryExecutive_retrive,
  getAllOrders,
} from "../../../CrudOperations/GetOperation";
import ConfirmationModal from "../ConfirmationModal";
import {
  CustomerModal,
  DeliveryExecutiveModal,
  ItemModal,
  MakeDeliveryBoyFreeModal,
  PaymentModal,
  ScheduleModal,
} from "../OrderModals";
import { AssignDelivery_Executive__ } from "../../../CrudOperations/PostOperation";
import LoadingModal from "../../../LoadingModal";
import {
  ChangeOrderStatus,
  ChangePaymentStatus,
  orderStatusChangeByMerchant,
  performAcceptOrderAction,
  performCollectOrderAction,
} from "../../../CrudOperations/Update&Edit";

const ManageOrder = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9; // Number of items per page

  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [order_status, setOrder_Status] = useState({
    status: null,
    id: null,
  });

  const [delivery_Exe_id, setDelivery_exe_id] = useState(0);

  const [assignDeliveryExecutive, setAssignDeliveryExecutive] = useState({
    e: null,
    orderId: null,
    name: null,
  });

  const [payment_status, setPayment_status] = useState({
    status: null,
    id: null,
  });

  // setDelivery_id

  const [loading, setIsLoad] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, new, old

  const [changeOrderStatusValue, setChangeOrderStatusValue] = useState("");

  // changeOrderStatusValue

  const [selectedItem, setSelectedItem] = useState(null);
  console.log(selectedItem);
  const [isOrderItemModalOpen, setOrderItemModalOpen] = useState(false);
  const [isOrderPaymentModalOpen, setIsOrderPaymentModalOpen] = useState(false);
  const [isOrderDeliveryModalOpen, setIsOrderDeliveryModalOpen] =
    useState(false);

  const [isCancelRequestModalOpen, setIsCancelRequestModalOpen] =
    useState(false);
  const [cancelRequestData, setCancelRequestData] = useState("");

  const [isMakeDelvieryBoyFreeModalOpen, setIsMakeDeliveryBoyFreeModalOpen] =
    useState(false);
  const [makeDeliveryBoyData, setmakeDeliveryBoyData] = useState("");

  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState("");

  const [isScheduledModal, setIsScheduledModal] = useState(false);
  const [scheduledTime_date, setScheduledTime_date] = useState("");

  const [isItemModal, setIsItemModal] = useState(false);
  const [Itemslist, setItemsList] = useState("");

  const [isDeliveryExecutiveModal, setIsDeliveryExecutiveModal] =
    useState(false);
  const [delivery_exe, setDelivery_Exe] = useState("");

  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");

  const [delivery_Exe_list, setDelivery_Exe_list] = useState([]);
  // delivery_Exe_list

  // isconfirmationModal
  const [isconfirmationModal, setIsconfirmationModal] = useState(false);

  const [totalPrice, setTotalPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoad(true);
    const fun = async () => {
      const response = await getAllOrders();
      if (
        response &&
        response.data.messsage == "All Orders Retrive Successfully!!"
      ) {
        setOrders(response.data.orders);
      }

      const getDeliveryExecutive = await AllDeliveryExecutive_retrive();
      if (getDeliveryExecutive) {
        console.log(getDeliveryExecutive);

        setDelivery_Exe_list(getDeliveryExecutive.data.data);
      }

      setIsLoad(false);
    };

    fun();
  }, []);

  // Filter and search logic
  let filteredOrders = orders
    .filter((order) => {
      const orderStatus = order.order_status?.order_status;
      console.log("Order Status:", orderStatus);
      console.log("Filter:", filter);

      if (filter === "all" || orderStatus === filter) {
        return true;
      }

      return false;
    })
    .reverse(); // 👈 Reverse the filtered results

  // filteredOrders = filteredOrders.sort((a, b) => {
  //   // Sorting orders by date, most recent first
  //   const dateA = new Date(a.order_receive_date);
  //   const dateB = new Date(b.order_receive_date);
  //   return dateB - dateA; // Newest date at the top
  // });

  // Calculate total pages

  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage) || 1;

  const validCurrentPage = Math.max(0, Math.min(currentPage, pageCount - 1));

  // Determine items for the current page
  const displayedOrders = filteredOrders.slice(
    validCurrentPage * itemsPerPage,
    (validCurrentPage + 1) * itemsPerPage
  );

  // Handle page changekrchuke
  const handlePageChange = ({ selected }) => {
    console.log(selected);

    setCurrentPage(selected);
  };

  const handleOrderItemClick = async (item, orderId, Total_Bill) => {
    console.log(item);
    console.log(orderId);
    console.log(Total_Bill);



    if (item == null) {
      return toast.error("item is null"); // Toggling the modal visibility
    }

    setItemsList({ item, orderId, Total_Bill }); // Setting the timeDate (or null if none provided)
    setIsItemModal(!isItemModal); // Toggling the modal visibility
  };

  const closeorderItemModal = () => {
    setOrderItemModalOpen(false);
    setSelectedItem(null);
  };

  const closeOrderPaymentModal = () => {
    setIsOrderPaymentModalOpen(false);
    setSelectedItem(null);
  };

  const closeOrderDeliveryModal = () => {
    setIsOrderDeliveryModalOpen(false);
    setSelectedItem(null);
  };

  const closeConfirmationModal = () => {
    setIsconfirmationModal(!isconfirmationModal);
  };

  const handleConfirmChangeStatus = async (messageObj) => {
    setIsLoad(true);

    const { message, data } = messageObj;
    console.log(message);
    console.log(data);

    if (message === "OrderStatus") {
      await ChangeOrderStatus({
        id: order_status.id,
        Status: order_status.status,
      });
    } else if (message === "assign_delivery_Executive") {
      const response = await AssignDelivery_Executive__({
        orderId: data.orderId,
        Delivery_Executive_Id: data.delivery_Exe_id,
      });
    } else if (message === "payment") {
      console.log(data);
      console.log(message);

      await ChangePaymentStatus({
        id: data.id,
        Status: data.status,
      });
    }
    const getOrder = await getAllOrders();
    if (
      getOrder &&
      getOrder.data.messsage == "All Orders Retrive Successfully!!"
    ) {
      setOrders(getOrder.data.orders);
      setIsconfirmationModal(!isconfirmationModal);
      setAssignDeliveryExecutive({
        e: null,
        orderId: null,
        name: null,
      });
      setOrder_Status({
        status: null,
        id: null,
      });

      setPayment_status({
        status: null,
        id: null,
      });
      setIsLoad(false);
    }
  };

  const handlemakeDeliveryBoyFreee = () => {
    setIsMakeDeliveryBoyFreeModalOpen(!isMakeDelvieryBoyFreeModalOpen);
  };

  const handleCustomerClick = (details) => {
    setCustomerDetails(details);
    setCustomerModalOpen(!isCustomerModalOpen);
  };

  const handleScheduledClick = (id, Expected_Delivery = null) => {
    console.log(Expected_Delivery);

    if (Expected_Delivery == null) {
      setScheduledTime_date({
        date: "0000-00-00",
        time: "00:00:00",
        day: "sunday",
        id: id,
      }); // Setting the timeDate (or null if none provided)

      return setIsScheduledModal(!isScheduledModal); // Toggling the modal visibility
    }

    setScheduledTime_date({
      date: Expected_Delivery.expected_DeliveryDate,
      time: Expected_Delivery.expected_DeliveryTime,
      id: id,
    }); // Setting the timeDate (or null if none provided)
    setIsScheduledModal(!isScheduledModal); // Toggling the modal visibility
  };

  // handleClickDeliveryExecutive

  const handleClickDeliveryExecutive = (
    id,
    unique_order_id,
    delivery_status,
    DeliveryExecutive = null
  ) => {
    setDelivery_Exe({
      id: id,
      unique_order_id: unique_order_id,
      delivery_status: delivery_status,
      DeliveryExecutive_details: DeliveryExecutive,
    });

    setIsDeliveryExecutiveModal(!isDeliveryExecutiveModal); // Toggling the modal visibility
  };

  // handlePaymentClick

  const handlePaymentClick = (
    payment_type,
    payment_status,
    unique_order_id
  ) => {
    setPaymentDetails({
      payment_type,
      payment_status,
      unique_order_id,
    });

    setIsPaymentModal(!isPaymentModal); // Toggling the modal visibility
  };

  // submitScheduledTime

  const submitScheduledTime = async (Scheduled_time) => {
    // Scheduled_time
    console.log(Scheduled_time);

    if (Scheduled_time) {
      const response = await getAllOrders();
      if (
        response &&
        response.data.messsage == "All Orders Retrive Successfully!!"
      ) {
        setOrders(response.data.orders);
      }
    }

    setIsScheduledModal(!isScheduledModal); // Toggling the modal visibility
  };

  const handleAcceptClick = async (orderId) => {
    console.log(orderId);

    setIsLoad(true);
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      console.log(currentDate);

      const response = await performAcceptOrderAction({
        message: "Accept",
        orderStatus: "Processed",
        orderId,
        currentDate,
      });
      console.log(response);

      if (response.data.message == "Order Accepted successfully!") {
        const response2 = await getAllOrders();
        if (
          response2 &&
          response2.data.messsage == "All Orders Retrive Successfully!!"
        ) {
          setOrders(response2.data.orders);
        }

        playSuccessTone();
        toast.success("Order accepted successfully!");
      }
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
    setIsLoad(false);
  };

  // handle_Reject_Click

  const handle_Reject_Click = async (orderId) => {
    console.log(orderId);

    setIsLoad(true);
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      console.log(currentDate);

      const response = await performAcceptOrderAction({
        message: "rejected",
        orderStatus: "cancelled",
        orderId,
        currentDate,
      });
      console.log(response);

      if (response.data.message == "Order Rejected successfully!") {
        const response2 = await getAllOrders();
        if (
          response2 &&
          response2.data.messsage == "All Orders Retrive Successfully!!"
        ) {
          setOrders(response2.data.orders);
        }

        playSuccessTone();
        toast.success("Order Rejected successfully!");
      }
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
    setIsLoad(false);
  };

  // handleCollectClick

  const handleCollectClick = async (orderId) => {
    console.log(orderId);

    setIsLoad(true);
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      console.log(currentDate);

      const response = await performCollectOrderAction({
        message: "Collect",
        orderStatus: "Processed",
        orderId,
        currentDate,
      });
      console.log(response);

      if (response.data.message == "Transaction successfully settled! Thank you for your prompt payment.") {
        const response2 = await getAllOrders();
        if (
          response2 &&
          response2.data.messsage == "All Orders Retrive Successfully!!"
        ) {
          setOrders(response2.data.orders);
        }

        playSuccessTone();
        toast.success("Transaction successfully settled! Thank you for your prompt payment.");
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log("Failed to accept order:", error);
    }
    setIsLoad(false);
  };

  const playSuccessTone = () => {
    const audio = new Audio(successTone); // Create a new audio instance
    audio.play(); // Play the imported audio file
  };

  const handleCancelRequest = () => {
    setIsCancelRequestModalOpen(!isCancelRequestModalOpen);
  };

  const handleOrderCancelSubmition = async () => {
    setIsLoad(true);

    try {
      const response = await getAllOrders();
      if (
        response &&
        response.data.messsage == "All Orders Retrive Successfully!!"
      ) {
        setOrders(response.data.orders);
      }

      setIsLoad(false);
    } catch (error) {
      toast.error("An error occurred while fetching orders.");
      console.error(error);

      setIsLoad(false);
    }
  };

  // orderStatus change by merchant...

  const handleOrderStatusChangeByMerchant = async (value, orderId) => {
    setIsLoad(true);
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      console.log(currentDate);

      const response = await orderStatusChangeByMerchant({
        toChangeStatus: value,
        orderId,
        currentDate,
      });
      console.log(response);

      if (response.data.message == `this order is successfully ${value}`) {
        const response2 = await getAllOrders();
        if (
          response2 &&
          response2.data.messsage == "All Orders Retrive Successfully!!"
        ) {
          setOrders(response2.data.orders);
        }

        toast.success(response.data.message);
      } else {
        toast.error(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to accept order:", error.response);
    }
    setIsLoad(false);
  };

  return loading ? (
    <LoadingModal />
  ) : (
    <div className=" p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <div className="flex flex-row  justify-between  w-full ">
        {loading && <LoadingModal />}
        <div className="flex flex-row  justify-between  w-full mb-7">
          <div className="flex gap-3">
            <BackButton />
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          </div>

          <div className="flex justify-center gap-4">
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={handleCancelRequest}
            >
              Generate Cancel Request
            </button>


                       <button
              className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-green-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={()=> navigate(`/admin/${localStorage.getItem("Merchanttoken")}/asignDeliveryExecutive`)}
            >
              Assign Delivery Executive
            </button>




            {/* <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={() =>
                navigate(
                  `/admin/${localStorage.getItem(
                    "Merchanttoken"
                  )}/asignDeliveryExecutive`
                )
              }
            >
              Assign Delivery Executive
            </button> */}
          </div>
        </div>
      </div>
      {console.log(orders)}

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Order ID"
          className="border px-4 py-2 rounded-md w-full sm:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter Dropdown */}
        <select
          className="border px-4 py-2 rounded-md w-full sm:w-1/4"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="received">received</option>
          <option value="processed">processed</option>
          <option value="shipped">shipped</option>
          <option value="cancelled">cancelled</option>
          <option value="completed">completed</option>
        </select>
      </div>

      {!displayedOrders.length > 0 ? (
        <div className="mt-10 ">
          <div className="text-red-500">NO Any Order!!</div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Order ID
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Order date
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Customer
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Items
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Schedule
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    order Status
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Delivery_Executive
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Payment
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Collect
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Action
                  </th>
                  {/* <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                  order_Delivery
                </th>
                <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                  order_Payment
                </th> */}
                </tr>
              </thead>
              <tbody>
                {searchQuery
                  ? orders
                      .filter(
                        (ele) =>
                          ele.unique_order_id.toLowerCase() ===
                          searchQuery.toLowerCase()
                      )

                      .map((item, index) => (
                        <tr key={item.id} className="bg-blue-200">
                          <td className="py-3 px-5 border-b border-gray-200">
                            {item.unique_order_id}
                          </td>

                          <td className="py-3 px-5 border-b border-gray-200">
                            {item.order_receive_date}
                          </td>

                          <td className="py-3 px-5 border-b border-gray-200">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleCustomerClick(item.Customer)}
                            >
                              <FaListAlt size={20} />
                            </button>
                          </td>
                          {console.log(item)}

                          <td className="py-3 px-5 border-b border-gray-200">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() =>
                                handleOrderItemClick(
                                  item.Items,
                                  item.unique_order_id,
                                  null
                                )
                              }
                            >
                              <FaListAlt size={20} />
                            </button>
                          </td>

                          <td className="py-3 px-5 border-b border-gray-200">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() =>
                                handleScheduledClick(
                                  item.id,
                                  item.Expected_Delivery &&
                                    item.Expected_Delivery
                                )
                              }
                            >
                              <VscCalendar size={20} />
                            </button>
                          </td>

                          <td className="py-3 px-5 border-b border-gray-200">
                            <div className="mb-2">
                              {item.order_status.order_status}
                            </div>
                          </td>

                          <td className="py-7 px-5 border-b border-gray-200 flex justify-center items-center">
                            <FaUserPlus
                              className="w-6 h-6 text-center"
                              onClick={() =>
                                handleClickDeliveryExecutive(
                                  item.id,
                                  item.unique_order_id,
                                  item.order_status.delivery_status,
                                  item.DeliveryExecutive
                                    ? item.DeliveryExecutive
                                    : null
                                )
                              }
                            />
                          </td>

                          {/*  <FaUserPlus className="w-6 h-6" /> */}

                          <td className="py-3 px-5 border-b border-gray-200">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() =>
                                handlePaymentClick(
                                  item.payment_type,
                                  item.order_status.payment_status,
                                  item.unique_order_id
                                )
                              }
                            >
                              <div className="">
                                <FaListAlt size={20} />
                              </div>
                            </button>
                          </td>

                          <td className="py-3 px-5 border-b border-gray-200">
                            {!item.Paid ? (
                              <div className="flex space-x-10">
                                <button
                                  className="p-2 shadow-lg rounded-sm text-green-500 border hover:text-green-700 hover:shadow-md hover:rounded-md"
                                  onClick={() => handleCollectClick(item.id)}
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
                              </div>
                            ) : (
                              <div>
                                <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white cursor-not-allowed bg-green-400">
                                  Collected
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="border-b border-gray-200">
                            {console.log(item.action)}{" "}
                            {/* Debugging to check the exact value */}
                            {item.action != "accepted" &&
                              item.action != "rejected" && (
                                <div className="flex space-x-10">
                                  <button
                                    className="p-2 shadow-lg rounded-sm text-green-500 border hover:text-green-700 hover:shadow-md hover:rounded-md"
                                    onClick={() => handleAcceptClick(item.id)}
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
                                    className="text-red-500 p-2 rounded-sm shadow-lg hover:text-red-700 hover:shadow-md hover:rounded-md"
                                    onClick={() => handle_Reject_Click(item.id)}
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
                            {item.action == "accepted" && (
                              <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white cursor-not-allowed bg-green-400">
                                Accepted
                              </div>
                            )}
                            {item.action == "rejected" && (
                              <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white bg-red-400">
                                Rejected
                              </div>
                            )}
                          </td>

                          {/* <td className="py-3 px-5 border-b border-gray-200">
                               <button
                                 className="text-blue-500 hover:text-blue-700"
                                 onClick={() => handleOrderDeliveryClick(item.order_id)}
                               >
                                 <FaListAlt size={20} />
                               </button>
                             </td>
           
                             <td className="py-3 px-5 border-b border-gray-200">
                               <button
                                 className="text-blue-500 hover:text-blue-700"
                                 onClick={() => handleOrderPaymentClick(item.order_id)}
                               >
                                 <FaListAlt size={20} />
                               </button>
                             </td> */}
                        </tr>
                      ))
                  : displayedOrders.map((item) => (
                      <tr
                        key={item.id}
                        className={`${
                          item.order_status.order_status === "received" &&
                          "bg-orange-100"
                        }`}
                      >
                        {console.log(item)}
                        <td className="py-3 px-5 border-b border-gray-200">
                          {item.unique_order_id}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          {item.order_receive_date}
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleCustomerClick(item.Customer)}
                          >
                            <FaListAlt size={20} />
                          </button>
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              handleOrderItemClick(
                                item.Items,
                                item.unique_order_id,
                                item.Total_Bill
                              )
                            }
                          >
                            <FaListAlt size={20} />
                          </button>
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              handleScheduledClick(
                                item.id,
                                item.Expected_Delivery && item.Expected_Delivery
                              )
                            }
                          >
                            <VscCalendar size={20} />
                          </button>
                        </td>

                        <td className="py-3 px-5 border-b border-gray-200">
                          <select
                            id="Status"
                            value={item.order_status.order_status}
                            onChange={(e) =>
                              handleOrderStatusChangeByMerchant(
                                e.target.value,
                                item.id
                              )
                            }
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Status</option>
                            <option key="received" value="received">
                              received
                            </option>
                            <option key="processed" value="processed">
                              processed
                            </option>
                            <option key="shipped" value="shipped">
                              shipped
                            </option>
                            <option key="cancelled" value="cancelled">
                              cancelled
                            </option>
                            <option key="completed" value="completed">
                              completed
                            </option>
                          </select>
                        </td>

                        <td className="py-7 px-5 border-b border-gray-200 flex justify-center items-center">
                          <FaUserPlus
                            className="w-6 h-6 text-center"
                            onClick={() =>
                              handleClickDeliveryExecutive(
                                item.id,
                                item.unique_order_id,
                                item.order_status.delivery_status,
                                item.DeliveryExecutive.length > 0
                                  ? item.DeliveryExecutive
                                  : null
                              )
                            }
                          />
                        </td>

                        {/*  <FaUserPlus className="w-6 h-6" /> */}

                        <td className="py-3 px-5 border-b border-gray-200">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              handlePaymentClick(
                                item.payment_type,
                                item.order_status.payment_status,
                                item.unique_order_id
                              )
                            }
                          >
                            <div className="">
                              <FaListAlt size={20} />
                            </div>
                          </button>
                        </td>

                        {/* Collect or not!!!! */}

                        <td className="py-3 px-5 border-b border-gray-200">
                          {!item.Paid ? (
                            <div className="flex space-x-10">
                              <button
                                className="p-2 shadow-lg rounded-sm text-green-500 border hover:text-green-700 hover:shadow-md hover:rounded-md"
                                onClick={() => handleCollectClick(item.id)}
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
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white cursor-not-allowed bg-green-400">
                                Collected
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="border-b border-gray-200">
                          {console.log(item.action)}{" "}
                          {/* Debugging to check the exact value */}
                          {item.action != "accepted" &&
                            item.action != "rejected" && (
                              <div className="flex space-x-10">
                                <button
                                  className="p-2 shadow-lg rounded-sm text-green-500 border hover:text-green-700 hover:shadow-md hover:rounded-md"
                                  onClick={() => handleAcceptClick(item.id)}
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
                                  className="text-red-500 p-2 rounded-sm shadow-lg hover:text-red-700 hover:shadow-md hover:rounded-md"
                                  onClick={() => handle_Reject_Click(item.id)}
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
                          {item.action == "accepted" && (
                            <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white cursor-not-allowed bg-green-400">
                              Accepted
                            </div>
                          )}
                          {item.action == "rejected" && (
                            <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white bg-red-400">
                              Rejected
                            </div>
                          )}
                        </td>

                        {/* <td className="py-3 px-5 border-b border-gray-200">
                             <button
                               className="text-blue-500 hover:text-blue-700"
                               onClick={() => handleOrderDeliveryClick(item.order_id)}
                             >
                               <FaListAlt size={20} />
                             </button>
                           </td>
           
                           <td className="py-3 px-5 border-b border-gray-200">
                             <button
                               className="text-blue-500 hover:text-blue-700"
                               onClick={() => handleOrderPaymentClick(item.order_id)}
                             >
                               <FaListAlt size={20} />
                             </button>
                           </td> */}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {console.log(displayedOrders)
          }
          <PaginationExample
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {isCustomerModalOpen && (
        <CustomerModal close={handleCustomerClick} customer={customerDetails} />
      )}

      {isScheduledModal && (
        <ScheduleModal
          close={handleScheduledClick}
          scheduled={scheduledTime_date}
          submit={submitScheduledTime}
        />
      )}

      {isItemModal && (
        <ItemModal
          close={handleOrderItemClick}
          ItemsData={Itemslist}
          // submit={submitScheduledTime}
        />
      )}

      {isconfirmationModal && (
        <ConfirmationModal
          closeConfirmationModal={closeConfirmationModal}
          Orderstatus={order_status.status}
          confirmChangeStatus={handleConfirmChangeStatus}
          assignDeliveryExecutive={assignDeliveryExecutive}
          paymentstatus={payment_status}
        />
      )}

      {/* PaymentModal */}

      {isPaymentModal && (
        <PaymentModal
          close={handlePaymentClick}
          setPaymentDetails={paymentDetails}
        />
      )}

      {isMakeDelvieryBoyFreeModalOpen && (
        <MakeDeliveryBoyFreeModal
          close={handlemakeDeliveryBoyFreee}
          makeDeliveryBoyData={makeDeliveryBoyData}
        />
      )}

      {/*  id: id,
      unique_order_id: unique_order_id,
      DeliveryExecutive_id : DeliveryExecutive_id, */}

      {isDeliveryExecutiveModal && (
        <DeliveryExecutiveModal
          close={handleClickDeliveryExecutive}
          executive={delivery_exe}
        />
      )}

      {isCancelRequestModalOpen && (
        <GenerateCancelRequestModal
          close={handleCancelRequest}
          cancelRequestData={cancelRequestData}
          handleOrderCancelSubmition={handleOrderCancelSubmition}
        />
      )}

      {isOrderPaymentModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
            {/* Title */}
            <h2 className="text-3xl font-extrabold mb-6 text-green-800">
              Order Payment Details
            </h2>

            {/* Scrollable Table Container */}
            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-green-100">
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      order_id
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      order status
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      payment status
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      payment gateway
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      payment option
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      payment mode
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      payment id
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      total tax
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      total gst
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      Delivery Charge
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      transaction id
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      total payment
                    </th>
                    <th className="py-3 px-4 text-start text-green-800 font-semibold">
                      confirmation date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem.map((variant, index) => (
                    <tr
                      className="border-b hover:bg-green-50 transition-colors"
                      key={variant.id}
                    >
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.unique_order_id}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.is_order_confirmed === 1
                          ? "confirmed"
                          : "pending"}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.is_payment_confirmed === 1
                          ? "confirmed"
                          : "pending"}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.payment_gateway}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.payment_option}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.payment_mode}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.payment_id}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.total_tax}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.total_gst}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.delivery_charge}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.transaction_id}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.total_payment}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.confirmation_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeOrderPaymentModal}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isOrderItemModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl shadow-2xl max-w-4xl w-full overflow-auto mx-auto">
            <div className="flex flex-row items-center justify-between gap-4 p-4 border border-gray-300 rounded-lg shadow-md mb-4 overflow-x-hidden">
              <h2 className="text-3xl font-extrabold mb-2 text-indigo-800">
                Order Items
              </h2>

              <span className="font-inter text-lg text-gray-700">
                Total Price:{" "}
                <span className="font-bold text-xl text-indigo-600">
                  {totalPrice}
                </span>
              </span>
            </div>

            {/* Horizontal scrolling applied here */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="py-3 px-4 text-start text-indigo-800 font-semibold">
                      SKU_ID
                    </th>
                    <th className="py-3 px-4 text-start text-indigo-800 font-semibold">
                      Image
                    </th>
                    <th className="py-3 px-4 text-start text-indigo-800 font-semibold">
                      Item Type
                    </th>
                    <th className="py-3 px-4 text-start text-indigo-800 font-semibold">
                      Item Name
                    </th>
                    <th className="py-3 px-4 text-start text-indigo-800 font-semibold">
                      Quantity
                    </th>
                    <th className="py-3 px-4 text-start text-indigo-800 font-semibold">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem.map((variant, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-indigo-50 transition-colors"
                    >
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.loose_sku_Id || variant.packet_varient_sku_Id}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        <img
                          src={variant.Image_url}
                          alt="Product"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.stock_type}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.loose_varient_title ||
                          variant.packet_varient_sku_name}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.quantity}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-200">
                        {variant.total_price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={closeorderItemModal}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isOrderDeliveryModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <h2 className="text-2xl font-extrabold mb-6 text-blue-700">
              Delivery Details
            </h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-4 text-start text-blue-800">
                    shipping_address
                  </th>
                  <th className="py-2 px-4 text-start text-blue-800">
                    delivery_executive
                  </th>
                  <th className="py-2 px-4 text-start text-blue-800">
                    shipment_status
                  </th>
                  <th className="py-2 px-4 text-start text-blue-800">
                    deliery_charge
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedItem.map((deliver) => (
                  <tr key={deliver.id} className="hover:bg-blue-50">
                    <td className="py-2 px-4 border-t border-gray-200">
                      {deliver.shipping_address}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-200">
                      {deliver.delivery_executive}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-200">
                      {deliver.shipment_status}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-200">
                      {deliver.delivery_charge}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeOrderDeliveryModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrder;
