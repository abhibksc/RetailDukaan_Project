import React, { useEffect, useState } from "react";
import OrderBar from "./OrderBar";
import { FaSearch } from "react-icons/fa";
import { getUserOrders } from "../../CrudOperations/GetOperation";
import LoadingModal from "../../LoadingModal";
import { useNavigate } from "react-router-dom";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState({});
  const [visibleOrders, setVisibleOrders] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUserOrders().then((response) => {
      if (response?.data?.message === "Successfully retrieved Customer Orders") {
        setOrders(response.data.Data);
      }
      setLoading(false);
    });
  }, []);

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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const filteredOrders = orders.filter((order) =>
    order.Items.some((item) =>
      item.ItemName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const displayOrders = searchQuery ? filteredOrders : orders;

  return loading ? (
    <div className="xl:h-screen">
      <LoadingModal />
    </div>
  ) : (
    <div className="xl:flex mx-6 xl:mx-20">
      <OrderBar setOrderFilter={setOrderFilter} />

      <main className="px-4 w-full">
        {/* Search Bar */}
        <div className="mb-6 w-full flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search orders..."
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 text-sm">
            <FaSearch />
            Search
          </button>
        </div>

        {/* Horizontal Row Cards */}
        <div className="space-y-4">
          {displayOrders.slice(0, visibleOrders).map((order) => (
            <div
              key={order.id}
              onClick={() =>
                navigate(`/order/order-details/${order.unique_order_id}`)
              }
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-shrink-0">
                <img
                  src={order.order_image || "/placeholder.jpg"}
                  alt="Order"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Grocery Order ({order.Items.length})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.unique_order_id}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:justify-end md:text-right">
                <div className="text-sm font-bold text-green-600">
                  ₹{order?.Total_Bill ?? "N/A"}
                </div>
                <div>
                  {order?.order_status?.order_status === "cancelled" ? (
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      Order Cancelled
                    </span>
                  ) : order?.order_status?.delivery_status === "delivered" ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Order Delivered
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                      Scheduled at {formatTime(order.Expected_Delivery.expected_DeliveryTime)} on{" "}
                      {formatDate(order.Expected_Delivery.expected_DeliveryDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {visibleOrders < displayOrders.length && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisibleOrders((prev) => prev + 5)}
              className="py-2 px-6 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition"
            >
              Show More
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserOrder;
