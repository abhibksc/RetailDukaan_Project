import React, { useEffect, useState } from "react";
import { FaListAlt, FaUpload, FaDownload, FaUserPlus } from "react-icons/fa"; // Importing icons from react-icons
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { VscCalendar } from "react-icons/vsc";

import { toast } from "react-toastify";
import PaginationExample from "../../../PaginationExample";
import LoadingModal from "../../../LoadingModal";
import { AssignDelivery_Executive__ } from "../../../CrudOperations/PostOperation";
import { AllDeliveryExecutive_retrive, getAllOrders, getCancelledRequest, GetItemDetails, order_Confirm_Payment_details, order_DeliveryData, OrderItem } from "../../../CrudOperations/GetOperation";
import ConfirmationModal from "../ConfirmationModal";
import { ChangeItemStatus, ChangeOrderStatus, ChangePaymentStatus, performAcceptCancel_OrderAction, performAcceptOrderAction } from "../../../CrudOperations/Update&Edit";
import { CancellationStatusModal, CustomerModal, DeliveryExecutiveModal, PaymentModal, ScheduleModal } from "../OrderModals";

import successTone from '../../../../assets/tones/successtone.mp3'
import { ItemModal } from "./CancelModal";
// import successTone from "../../../assets/tones/successtone.mp3"; // Import the success tone audio file










const CancelRequests = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9; // Number of items per page

  const [items, setItems] = useState([]);
  const [CancelRequests, setCancelRequests] = useState([]);
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

  const [selectedItem, setSelectedItem] = useState(null);
  console.log(selectedItem);
  const [isOrderItemModalOpen, setOrderItemModalOpen] = useState(false);
  const [isOrderPaymentModalOpen, setIsOrderPaymentModalOpen] = useState(false);
  const [isOrderDeliveryModalOpen, setIsOrderDeliveryModalOpen] =
    useState(false);

  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState("");

  const [isCancellationStatusModalOpen, setCancellationStatusModalOpen] = useState(false);
  const [cancellationStatus_Details, setCancellationStatuss_Details] = useState("");

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
      const response = await getCancelledRequest();

      console.log(response);
      
      if (
        response &&
        response.data.messsage == "All Cancel Requests Retrive Successfully!!"
      ) {
        setCancelRequests(response.data.requests);
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
  let filteredCancelRequests = CancelRequests
  .filter((order) => {
    // Additional filtering logic based on order_status
    const cancellation_Status = order.cancellation_status;
    console.log("Order Status:", cancellation_Status);
    console.log("Filter:", filter);

    if (filter === "all" || cancellation_Status === filter) {
      return true;
    }

    // Default to exclude the order if none of the conditions are met
    return false;
  })


  filteredCancelRequests = filteredCancelRequests.sort((a, b) => {
    // Sorting orders by date, most recent first
    const dateA = new Date(a.requested_at);
    const dateB = new Date(b.requested_at);
    return dateB - dateA; // Newest date at the top
  });


  const pageCount = Math.ceil(filteredCancelRequests.length / itemsPerPage) || 1;

  const validCurrentPage = Math.max(0, Math.min(currentPage, pageCount - 1));

  // Determine items for the current page
  const displayedCancelRequests = filteredCancelRequests.slice(
    validCurrentPage * itemsPerPage,
    (validCurrentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    console.log(selected);

    setCurrentPage(selected);
  };

 

 

  // useEffect(() => {
  //   console.log(filteredCancelRequests);
  // }, [filteredCancelRequests]);

  // Calculate total pages
  // const pageCount = Math.ceil(filteredCancelRequests.length / itemsPerPage) || 1;

  // const validCurrentPage = Math.max(0, Math.min(currentPage, pageCount - 1));

  // // Determine items for the current page
  // const displayedCancelRequests = filteredCancelRequests.slice(
  //   validCurrentPage * itemsPerPage,
  //   (validCurrentPage + 1) * itemsPerPage
  // );


  // Handle page changekrchuke
  // const handlePageChange = ({ selected }) => {
  //   console.log(selected);

  //   setCurrentPage(selected);
  // };


  const handleOrderItemClick = async (item, orderId , cancellation_status) => {
    console.log(item);

    // console.log(Expected_Delivery);

    if (item == null) {
      return toast.error("item is null"); // Toggling the modal visibility
    }

    setItemsList({ item, orderId ,cancellation_status }); // Setting the timeDate (or null if none provided)
    setIsItemModal(!isItemModal); // Toggling the modal visibility
  };

  const submission = async()=>{


    const response = await getCancelledRequest();

    console.log(response);
    
    if (
      response &&
      response.data.messsage == "All Cancel Requests Retrive Successfully!!"
    ) {
      setCancelRequests(response.data.requests);
      setIsItemModal(!isItemModal); // Toggling the modal visibility
    }
    
  }

  const handleOrderPaymentClick = async (item) => {
    console.log("chala");

    try {
      const response = await order_Confirm_Payment_details(item);
      console.log(response);
      setSelectedItem(response.data);
      setIsOrderPaymentModalOpen(true);
    } catch (error) {
      console.error("Error fetching order payment:", error);
      alert("Failed to fetch order payment. Please try again later.");
    }
  };

  const handleOrderDeliveryClick = async (item) => {
    console.log("chala");

    try {
      const response = await order_DeliveryData(item);
      console.log(response);
      setSelectedItem(response.data);
      setIsOrderDeliveryModalOpen(true);
    } catch (error) {
      console.error("Error fetching order items:", error);
      alert("Failed to fetch order items. Please try again later.");
    }
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

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stocks");
    XLSX.writeFile(workbook, "stocks.xlsx");
  };

  const handleUploadExcel = (event) => {
    console.log("Upload triggered");

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const newItems = XLSX.utils.sheet_to_json(worksheet);
      console.log(newItems);

      // Send the data as a JSON string
      const response = await fetch("http://localhost:8000/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: newItems }), // Correctly formatted JSON string
      });

      const result = await response.json();
      console.log("Response from API:", result);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleform = (event) => {
    console.log(" triggered");

    const token = localStorage.getItem("Merchanttoken");

    navigate(`/admin/${token}/itemform`);
  };

  const handleStatus = async (id, e) => {
    console.log(e.target.value);

    setAssignDeliveryExecutive({
      e: null,
      orderId: null,
      name: null,
    });

    setPayment_status({
      status: null,
      id: null,
    });

    setOrder_Status({
      status: e.target.value,
      id: id,
    });
    setIsconfirmationModal(true);
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
      setCancelRequests(getOrder.data.orders);
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

  const Assign_DeliveryExecutive = (orderId, e) => {
    console.log(e);
    console.log(delivery_Exe_list);

    setOrder_Status({
      status: null,
      id: null,
    });

    setPayment_status({
      status: null,
      id: null,
    });

    const filterDeliveryExecutive = delivery_Exe_list.find(
      (ele) => ele.id == e
    );
    console.log(filterDeliveryExecutive);

    const filter_OrderId = orders.find((ele) => ele.id == orderId);
    console.log(filter_OrderId);

    setAssignDeliveryExecutive({
      delivery_Exe_id: Number(e),
      orderId: filter_OrderId.unique_order_id,
      name: filterDeliveryExecutive.name,
    });

    // setDelivery_exe_id(e);

    setIsconfirmationModal(true);
  };

  const handlePaymentStatus = (id, e) => {
    console.log(e.target.value);

    setPayment_status({
      status: e.target.value,
      id: id,
    });

    setAssignDeliveryExecutive({
      e: null,
      orderId: null,
      name: null,
    });
    setOrder_Status({
      status: null,
      id: null,
    });

    setIsconfirmationModal(true);
  };

  const handleCustomerClick = (details) => {
    setCustomerDetails(details);
    setCustomerModalOpen(!isCustomerModalOpen);
  };

  const handleCancellationStatusClick = (cancellation_status, cancellation_reasons, unique_order_id,
    cancellations_id, cancelled_on) => {




      setCancellationStatuss_Details({
        cancellation_status : cancellation_status ? cancellation_status : null,
        cancellation_reasons : cancellation_reasons ? cancellation_reasons : null,
        unique_order_id : unique_order_id ? unique_order_id : null,
        cancellations_id : cancellations_id ? cancellations_id : null,
        cancelled_on : cancelled_on ? cancelled_on : null,
      });
    setCancellationStatusModalOpen(!isCancellationStatusModalOpen);
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

    Payment,
    unique_order_id
  ) => {
    setPaymentDetails({
      payment_type :  Payment.payment_type,
      refund_required :  Payment.refund_required,
      refund_status :  Payment.refund_status,
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
        setCancelRequests(response.data.orders);
      }
    }

    setIsScheduledModal(!isScheduledModal); // Toggling the modal visibility
  };



  const submitCancellation = async (Scheduled_time) => {
    // Scheduled_time
    console.log(Scheduled_time);

    if (Scheduled_time) {
      const response = await getAllOrders();
      if (
        response &&
        response.data.messsage == "All Orders Retrive Successfully!!"
      ) {
        setCancelRequests(response.data.orders);
      }
    }

    setIsScheduledModal(!isScheduledModal); // Toggling the modal visibility
  };

  const handleAcceptClick = async (cancellationId,order_id , initiatedby) => {

    setIsLoad(true);
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      console.log(currentDate);

      const response = await performAcceptCancel_OrderAction({
        message:    initiatedby === 'Delivery Exe' ? "DELIVERY EXECUTIVE REQUEST APPROVED" :  initiatedby === 'Customer' ? "CUSTOMER REQUEST APPROVED" : initiatedby === 'Merchant' ? "MERCHANT REQUEST APPROVED" : "",
        cancellationStatus: "Processed",
        cancellationId,
        order_id,
        currentDate,
      });
      console.log(response);

      if (response.data.message == "Cancel Request Approved successfully!") {


       const response2 = await getCancelledRequest();

      console.log(response2);
      
      if (
        response2 &&
        response2.data.messsage == "All Cancel Requests Retrive Successfully!!"
      ) {
        setCancelRequests(response2.data.requests);
      }

      toast.success("Cancel Request Approved successfully!");

        playSuccessTone();
      }


    } catch (error) {
      console.error("Failed to accept order:", error);
    }
    setIsLoad(false);
  };

  const playSuccessTone = () => {
    const audio = new Audio(successTone); // Create a new audio instance
    audio.play(); // Play the imported audio file
  };

  return loading ? (
    <LoadingModal />
  ) : (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <div className="flex flex-row  justify-between  w-full ">
        {loading && <LoadingModal />}
        <div className="flex flex-row  justify-between  w-full mb-7">
        <h1 className="text-lg font-bold border-b-2 text-gray-800">
        Cancel Request
        </h1>


          {/* <div className="flex justify-center">
            <button
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
            </button>
          </div> */}


        </div>
      </div>

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
          <option value="Received">received</option>
          <option value="Pending">pending</option>
          <option value="Approved">approved</option>
          <option value="Rejected">rejected</option>
        </select>
      </div>

    
      
      
      
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Cancellation ID
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Order ID
                  </th>


                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    request date
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Initiated by
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Customer
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Items
                  </th>

                  {/* <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Delivery Scheduled
                  </th> */}

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                  Status
                  </th>

                  {/* <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Delivery_Executive
                  </th> */}

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Payment
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
              {console.log(displayedCancelRequests)}
              

                <tbody>
                              {searchQuery
                                ? CancelRequests
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
                                                item.cancellation_status
                                              )
                                            }
                                          >
                                            <FaListAlt size={20} />
                                          </button>
                                        </td>
                                        {console.log(item)}
              
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
              
                                        <td className="border-b border-gray-200">
                                          {console.log(item.action)}{" "}
                                          {/* Debugging to check the exact value */}
                                          {item.action != "accepted" &&
                                            item.action != "rejected" && (
                                              <div className="flex space-x-10">
                                                <button
                                                  className="p-2 shadow-lg rounded-sm text-green-500 border hover:text-green-700 hover:shadow-md hover:rounded-md"
                                                  onClick={() => handleAcceptClick(item.bckend_cancellations_id , item.bckend_order_id)}
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
                                                  onClick={() =>
                                                    handle_Reject_Click(item.order_id)
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
              
                                    
                                      </tr>
                                    ))
                                : 

                                
                                
                                displayedCancelRequests.map((item, index) => (

                                  
                                    <tr key={index} className={`${item.cancellation_status === "Received" && 'bg-orange-100'}`}>
                                      <td className="py-3 px-5 border-b border-gray-200">
                                        {item.cancellations_id}
                                      </td>
              
                                      <td className="py-3 px-5 border-b border-gray-200">
                                        {item.unique_order_id}
                                      </td>

                                      <td className="py-3 px-5 border-b border-gray-200">
                                        {item.requested_at}
                                      </td>

                                      <td className="py-3 px-5 border-b border-gray-200">
                                        {item.initiated_by}
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
                                              item.cancellation_status
                                            )
                                          }
                                        >
                                          <FaListAlt size={20} />
                                        </button>
                                      </td>
              
                                      {/* <td className="py-3 px-5 border-b border-gray-200">
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
                                      </td> */}

<td className="py-3 px-5 border-b border-gray-200">
                                        <button
                                          className="text-blue-500 hover:text-blue-700"
                                          onClick={() => handleCancellationStatusClick(item.cancellation_status, item.cancellation_reasons, item.unique_order_id, item.
                                            cancellations_id, item.cancelled_on)}
                                        >
                                          <FaListAlt size={20} />
                                        </button>
                                      </td>
              
                                      {/* <td className="py-3 px-5 border-b border-gray-200">
                                        <div className="mb-2">
                                          {item.cancellation_status}
                                        </div>
                                      </td> */}
              
                                      {/* <td className="py-7 px-5 border-b border-gray-200 flex justify-center items-center">
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
                                      </td> */}
              
                                      {/*  <FaUserPlus className="w-6 h-6" /> */}
              
                                      <td className="py-3 px-5 border-b border-gray-200">
                                        <button
                                          className="text-blue-500 hover:text-blue-700"
                                          onClick={() =>
                                            handlePaymentClick(
                                              item.Payment,
                                              item.unique_order_id
                                            )
                                          }
                                        >
                                          <div className="">
                                            <FaListAlt size={20} />
                                          </div>
                                        </button>
                                      </td>
              
                                      <td className="border-b border-gray-200">
                                        {/* Debugging to check the exact value */}
                                        {console.log(item)
                                        }
                                        {item.cancellation_status != "Approved" &&
                                          item.cancellation_status != "Rejected" && (
                                            <div className="flex space-x-10">
                                              <button
                                                className="p-2 shadow-lg rounded-sm text-green-500 border hover:text-green-700 hover:shadow-md hover:rounded-md"
                                                onClick={() => handleAcceptClick(item.bckend_cancellations_id , item.bckend_order_id , item.initiated_by)}
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
                                                onClick={() =>
                                                  handle_Reject_Click(item.order_id)
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
                                                    d="M6 18L18 6M6 6l12 12"
                                                  />
                                                </svg>
                                              </button>
                                            </div>
                                          )}
                                        {item.cancellation_status == "Approved" && (
                                          <div className="flex justify-center items-center text-center p-1 rounded-md shadow-md text-white cursor-not-allowed bg-green-400">
                                            Approved
                                          </div>
                                        )}
                                        {item.cancellation_status == "Rejected" && (
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
          <PaginationExample
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
      


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


{isCancellationStatusModalOpen && (
        <CancellationStatusModal
          close={handleCancellationStatusClick}
          cancellationStatus_Details={cancellationStatus_Details}
        />
      )}

      {isItemModal && (
        <ItemModal
          close={handleOrderItemClick}
          ItemsData={Itemslist}
          submission={submission}
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

      {/*  id: id,
      unique_order_id: unique_order_id,
      DeliveryExecutive_id : DeliveryExecutive_id, */}

      {isDeliveryExecutiveModal && (
        <DeliveryExecutiveModal
          close={handleClickDeliveryExecutive}
          executive={delivery_exe}
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

export default CancelRequests;
