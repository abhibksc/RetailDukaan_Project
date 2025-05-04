import React, { useEffect, useState } from "react";
import OrderBar from "./S_OrderBar";
import { FaSearch } from "react-icons/fa";
import { getUserOrders } from "../../CrudOperations/GetOperation";
import LoadingModal from "../../LoadingModal";
import { useNavigate } from "react-router-dom";
import S_OrderBar from "./S_OrderBar";
import BackButton from "../../BackButton";
import { SlArrowRight } from "react-icons/sl";
import { FaFilter } from "react-icons/fa";


const S_UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);

  // isOpenFilterModal
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState({
    orderTime: "",
    orderStatus: "",
  });
  const [visibleOrders, setVisibleOrders] = useState(5); // Control number of orders shown
  const navigate = useNavigate();

  const handleOrderClick = (orderId) => {
    navigate(`/order/order-details/${orderId}`);
  };

  useEffect(() => {
    setLoading(true);
    const fetchOrders = async () => {
      const response = await getUserOrders();
      if (response && response.data.message === `Successfully retrived Customer Orders`) {
        setOrders(response.data.Data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderFilter.orderTime || orderFilter.orderStatus) {
      setOrders(orderFilter.orderTime || orderFilter.orderStatus);
    }
  }, [orderFilter]);

  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { month: "short", day: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleShowMore = () => {
    setVisibleOrders((prev) => prev + 10); // Show 10 more orders
  };

  const handleShowAll = () => {
    setVisibleOrders(orders.length); // Show all orders
  };

  return loading ? (
    <div className="h-screen">
      <LoadingModal />
    </div>
  ) : (
    <div className="w-full">

      <header className="shadow-md shadow-gray-700 mb-3 bg-gradient-to-b from-green-400 to-white">
  <div className="flex mx-3">
  <BackButton className=""/> 
  <h1 className="mt-2 ml-4 font-semibold text-gray-700">My Order</h1>  
    </div>      
      </header>
      {/* Sidebar for filters */}
  {/* {isOpenFilterModal &&    <S_OrderBar setOrderFilter={setOrderFilter} onclose={()=>setIsOpenFilterModal(false)} />} */}

      <main className="">
        {/* Search Bar */}
        <div className="mb-5  mx-1 flex justify-between  flex-row">
        <div className="flex">
        <input
            type="text"
            placeholder="Search orders..."
            className="flex-grow p-2 border border-gray-300 rounded-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="flex text-sm items-center gap-2 shadow-md  px-4 rounded-sm bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FaSearch className="text-sm " />
          </button>
        </div>


        {/* <div className="flex items-center space-x-2 mr-4" onClick={()=>setIsOpenFilterModal(true)}>
  <FaFilter className="text-gray-600" />
  <span>Filter</span>
</div> */}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto mx-1">
          <table className="w-full border-collapse border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {/* Table header */}
              </tr>
            </thead>

            <tbody>
              {searchQuery
                ? orders
                    .filter((order) =>
                      order.Items.some((item) =>
                        item.ItemName.toLowerCase().includes(
                          searchQuery.toLowerCase()
                        )
                      )
                    )
                    .slice(0, visibleOrders)
                    .map((order) => (
                      <tr
                        onClick={() => handleOrderClick(order.unique_order_id)}
                        key={order.id}
                        className="hover:bg-gray-50 transition duration-200 cursor-pointer"
                      >
                       <td className="border-b bg-white p-7 w-full flex justify-between gap-3 text-sm text-gray-800">
                        <div className="flex gap-4 items-center">
                          <img
                            src={order.Items[0].image}
                            alt="Item"
                            className="w-16 h-16 object-cover rounded-sm"
                          />
                          <div className="flex flex-col gap-2">
                            <p className="text-gray-600 font-semibold">
                            {order.order_status.order_status === "cancelled"
                          ? "Order Cancelled"
                          : order.order_status.delivery_status === "delivered"
                          ? "Order Delivered"
                          : `Scheduled at ${formatTime(
                              order.Expected_Delivery.expected_DeliveryTime
                            )} on ${formatDate(
                              order.Expected_Delivery.expected_DeliveryDate
                            )}`}
                            </p>
                            <p className="text-gray-600">
                            Grocery Order ({order.Items.length})
                            </p>
                          </div>
                        </div>
                        <div className="my-auto">
                        <SlArrowRight className=""/>
                        </div>
                      </td>
                      </tr>
                    ))
                : orders.slice(0, visibleOrders).map((order) => (
                    <tr
                      onClick={() => handleOrderClick(order.unique_order_id)}
                      key={order.id}
                      className="hover:bg-gray-50 transition duration-200 cursor-pointer"
                    >
                      <td className="border-b bg-white p-7 w-full flex justify-between gap-3 text-sm text-gray-800">
                        <div className="flex gap-4 items-center">
                          <img
                            src={order.Items[0].image}
                            alt="Item"
                            className="w-16 h-16 object-cover rounded-sm"
                          />
                          <div className="flex flex-col gap-2">
                            <p className="text-gray-600 font-semibold">
                            {order.order_status.order_status === "cancelled"
                          ? "Order Cancelled"
                          : order.order_status.delivery_status === "delivered"
                          ? "Order Delivered"
                          : `Scheduled at ${formatTime(
                              order.Expected_Delivery.expected_DeliveryTime
                            )} on ${formatDate(
                              order.Expected_Delivery.expected_DeliveryDate
                            )}`}
                            </p>
                            <p className="text-gray-600">
                            Grocery Order ({order.Items.length})
                            </p>
                          </div>
                        </div>
                        <div className="my-auto">
                        <SlArrowRight className=""/>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Show More / Show All Buttons */}
        {visibleOrders < orders.length && (
          <div className="mt-5 flex justify-center gap-4">
            <button
              onClick={handleShowMore}
              className="py-1 px-6  font-semibold  text-blue-500 bg-white shadow-lg"
            >
              Show More
            </button>
            {/* <button
              onClick={handleShowAll}
              className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-700"
            >
              Show All
            </button> */}
          </div>
        )}
      </main>
    </div>
  );
};

export default S_UserOrder;
