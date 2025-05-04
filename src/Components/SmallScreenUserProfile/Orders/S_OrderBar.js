import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../CrudOperations/GetOperation";

const statusMapping = {
  "On the way": "processed",
  "Delivered": "completed",
  "Cancelled": "cancelled",
  "Returned": "returned"
};

const S_OrderBar = ({ setOrderFilter, onClose }) => {
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

  const handleOrderStatusChange = (displayStatus) => {
    const dbStatus = statusMapping[displayStatus];
    setOrderStatus(dbStatus);
    setOrderTimeFilter("last-30-days");
  };

  const applyFilters = () => {
    if (orderStatus === "all") {
      setOrderFilter({ orderTime: "", orderStatus: orders });
      return;
    }

    const filteredByStatusData = orders.filter((od) =>
      od.order_status.order_status === orderStatus
    );
    setOrderFilter({ orderTime: "", orderStatus: filteredByStatusData });
  };

  return (
    <div className="fixed z-50 inset-0 flex items-end justify-center bg-black bg-opacity-50">
      <div
        className="w-full text-white rounded-t-lg shadow-lg relative bg-white p-6 border-r border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-6 border-b pb-2">
          <h2 className="text-xl font-thin text-black">Filters</h2>
          <button
            className="text-blue-600 text-sm"
            onClick={() => {
              setOrderTimeFilter("last-30-days");
              setOrderStatus("all");
              setStartDate("");
              setEndDate("");
              setOrderFilter({ orderTime: "", orderStatus: "" });
            }}
          >
            Clear Filter
          </button>
        </div>

        <h2 className="text-lg font-medium text-black mb-4">Order Status</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(statusMapping).map((displayStatus) => (
            <button
              key={displayStatus}
              className={`py-2 px-4 border rounded-md text-black text-center ${
                orderStatus === statusMapping[displayStatus] ? "bg-gray-300" : ""
              }`}
              onClick={() => handleOrderStatusChange(displayStatus)}
            >
              {displayStatus}
            </button>
          ))}
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={applyFilters}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default S_OrderBar;