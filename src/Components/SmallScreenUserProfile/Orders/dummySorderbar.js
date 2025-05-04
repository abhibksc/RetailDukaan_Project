import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../CrudOperations/GetOperation";

const S_OrderBar = ({ setOrderFilter }) => {
  const [orders, setOrders] = useState([]);
  const [orderTimeFilter, setOrderTimeFilter] = useState("last-30-days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getUserOrders();
      if (
        response &&
        response.data.message === `Successfully retrived Customer Orders`
      ) {
        setOrders(response.data.Data);
      }
    };
    fetchOrders();
  }, []);

  const handleOrderTimeChange = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const value = e.target.value;
    setOrderStatus("all");

    if (value === "last-30-days") {
      const today = new Date();
      const last30Days = new Date();
      last30Days.setDate(today.getDate() - 30);

      const filteredOrders = orders.filter((od) => {
        const orderDate = new Date(od.order_track.order_recived_date);
        return orderDate >= last30Days && orderDate <= today;
      });

      setOrderTimeFilter(value);
      setOrderFilter({ orderTime: filteredOrders, orderStatus: "" });
      return;
    }

    const filteredByYearData = orders.filter((od) => {
      const orderDate = od.order_track.order_recived_date;
      return orderDate && orderDate.startsWith(value);
    });

    setOrderFilter({ orderTime: filteredByYearData, orderStatus: "" });
    setOrderTimeFilter(value);
  };

  const handleOrderStatusChange = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const value = e.target.value;
    setOrderTimeFilter("last-30-days");

    if (value === "all") {
      setOrderFilter({ orderTime: "", orderStatus: orders });
      setOrderStatus(value);
      return;
    }

    const filteredByStatusData = orders.filter((od) => {
      const orderStatus = od.order_status.order_status;
      return (
        orderStatus === value ||
        (value === "processed" &&
          ["processed", "shipped", "received"].includes(orderStatus))
      );
    });

    setOrderFilter({ orderTime: "", orderStatus: filteredByStatusData });
    setOrderStatus(value);
  };

  const handleCustomDateChange = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setStartDate(e.target.value);
    setOrderFilter({
      type: "custom",
      startDate: e.target.value,
      endDate,
      status: orderStatus,
    });
  };

  const handleEndDateChange = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setEndDate(e.target.value);
    setOrderFilter({
      type: "custom",
      startDate,
      endDate: e.target.value,
      status: orderStatus,
    });
  };

  return (
    <div className="fixed z-50 inset-0 flex items-end justify-center bg-black bg-opacity-50">
      <div
        className="w-full  text-white  rounded-t-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <aside className=" bg-white p-6 border-r border-gray-200">
          <h2 className="text-xl font-thin text-black border-b-2 mb-6">
            Filters
          </h2>

          {/* Order Status Filter */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-[14px]">
              Order Status
            </label>
            <select
              className="w-full py-1 px-2 border border-gray-300 rounded-md"
              value={orderStatus}
              onChange={handleOrderStatusChange}
            >
              <option value="all">All</option>
              <option value="processed">On the way</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Order Time Filter */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-[14px]">
              Order Time
            </label>
            <select
              className="w-full py-1 px-2 border border-gray-300 rounded-lg"
              value={orderTimeFilter}
              onChange={handleOrderTimeChange}
            >
              <option value="last-30-days">Last 30 days</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default S_OrderBar;
