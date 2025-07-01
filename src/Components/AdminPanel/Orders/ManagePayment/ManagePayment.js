import React, { useEffect, useState } from "react";
import { FaListAlt, FaUpload, FaDownload, FaUserPlus } from "react-icons/fa"; // Importing icons from react-icons
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
// import {
//   GetItemDetails,
//   getAllOrders,
//   order_Confirm_Payment_details,
//   order_DeliveryData,
//   OrderItem,
//   AllDeliveryExecutive_retrive,
// } from "../../CrudOperations/GetOperation";
// import ConfirmationModal from "./ConfirmationModal";
// import {
//   ChangeItemStatus,
//   ChangeOrderStatus,
//   ChangePaymentStatus,
//   orderStatusChangeByMerchant,
//   performAcceptOrderAction,
// } from "../../CrudOperations/Update&Edit";
// import LoadingModal from "../../LoadingModal";
// import { AssignDelivery_Executive__ } from "../../CrudOperations/PostOperation";
// import {
//   CustomerModal,
//   DeliveryExecutiveModal,
//   ItemModal,
//   MakeDeliveryBoyFreeModal,
//   PaymentModal,
//   ScheduleModal,
// } from "./OrderModals";
import { VscCalendar } from "react-icons/vsc";

// import successTone from "../../assets/success-tone.mp3"; // Import the success tone audio file

// import successTone from "../../../assets/tones/successtone.mp3"; // Import the success tone audio file
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal";
import GenerateCancelRequestModal from "../GenerateCancelRequestModal";
import PaginationExample from "../../../PaginationExample";
import LoadingModal from "../../../LoadingModal";
import { AssignDelivery_Executive__ } from "../../../CrudOperations/PostOperation";
import {
  AllDeliveryExecutive_retrive,
  GetAllConfirmPayments,
  getAllOrders,
  GetItemDetails,
  order_Confirm_Payment_details,
  order_DeliveryData,
  OrderItem,
} from "../../../CrudOperations/GetOperation";
import {
  CustomerModal,
  DeliveryExecutiveModal,
  ItemModal,
  MakeDeliveryBoyFreeModal,
  PaymentModal,
  ScheduleModal,
} from "../OrderModals";
import PaymentSearchQuery from "./PaymentSearchQuery";
// import PaginationExample from "../Stocks/Purchase/PaginationExample";
// import GenerateCancelRequestModal from "./GenerateCancelRequestModal";

const ManagePayment = () => {
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
      const response = await GetAllConfirmPayments();
      console.log(response);

      if (
        response &&
        response.data.message === "All Confirm Payment successfully retrieved"
      ) {
        console.log(response);

        setOrders(response.data.payment);
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
  let filteredOrders = orders.filter((order) => {
    // Additional filtering logic based on order_status
    const orderStatus = order.payment;
    console.log("Order Status:", orderStatus);
    console.log("Filter:", filter);

    if (filter === "all" || orderStatus === filter) {
      return true;
    }

    // Default to exclude the order if none of the conditions are met
    return false;
  }).reverse();
  
  filteredOrders = filteredOrders.sort((a, b) => {
    // Sorting orders by date, most recent first
    const dateA = new Date(a.order_receive_date);
    const dateB = new Date(b.order_receive_date);
    return dateB - dateA; // Newest date at the top
  });

  useEffect(() => {
    console.log(filteredOrders);
  }, [filteredOrders]);

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

  console.log(items);

  const handleOrderItemClick = async (item, orderId, Total_Bill) => {
    console.log(item);

    // console.log(Expected_Delivery);

    if (item == null) {
      return toast.error("item is null"); // Toggling the modal visibility
    }

    setItemsList({ item, orderId, Total_Bill }); // Setting the timeDate (or null if none provided)
    setIsItemModal(!isItemModal); // Toggling the modal visibility
  };

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
    console.log(value); // Logs the selected value
    console.log(orderId); // Access a custom data attribute

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
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <div className="flex flex-row  justify-between  w-full ">
        {loading && <LoadingModal />}
        <div className="flex flex-row  justify-between  w-full mb-7">
          <h1 className="text-3xl font-bold text-gray-800">Payment</h1>

          <div className="flex justify-center gap-4">
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={handleCancelRequest}
            >
              Generate Cancel Request
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
          <option value="success">success</option>
          <option value="failed">failed</option>
          <option value="pending">pending</option>
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
                    Payment date
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    status
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Failed Reason
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Payment Type
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    Payment Method
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    payment_id
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    receipt
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    amount
                  </th>

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    currency
                  </th>

                  {/* ******************* */}

                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    email
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    contact
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    fee
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    tax
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    captured
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    description
                  </th>
                  <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                    invoice_id
                  </th>

                  {/* ***************** */}

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
                {searchQuery ? (
                  <PaymentSearchQuery orders={orders} />
                ) : (
                  displayedOrders.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        item.status === "success" && "bg-orange-100"
                      }`}
                    >
                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.un_Order_id}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {new Date(item.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.status}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.failure_reason}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.payment_type}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.method}
                      </td>


                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.payment_id}
                      </td>

                      {/*  <FaUserPlus className="w-6 h-6" /> */}

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.receipt}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.amount}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.currency}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.email}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.contact}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.fee}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.tax}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.captured}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.description}
                      </td>

                      <td className="py-3 px-5 border-b border-gray-200">
                        {item.invoice_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <PaginationExample
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {console.log(isconfirmationModal)}

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

export default ManagePayment;
