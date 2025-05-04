import React, { useEffect, useState } from 'react';
import { log } from 'tone/build/esm/core/util/Debug';
import { getUserOrders } from '../../CrudOperations/GetOperation';

const OrderBar = ({ setOrderFilter }) => {
    const [orders, setOrders] = useState([]);
  
  const [orderTimeFilter, setOrderTimeFilter] = useState('last-30-days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');  // Added state for order status


    useEffect(() => {
      const fetchOrders = async () => {

          const response = await getUserOrders();
            if (response && response.data.message === `Successfully retrived Customer Orders`) {
              setOrders(response.data.Data);
            }
            

      };
  
      fetchOrders();
    }, []);









const handleOrderTimeChange = (e) => {
  const value = e.target.value;
  setOrderStatus("All");

  console.log(orders);


  console.log("Selected Value:", value);

  // Handle "Last 30 Days" filter
  if (value === 'last-30-days') {
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    console.log(last30Days);


    const filteredLast30Days = orders.filter((od) => {
      const orderDate = new Date(od.order_track.order_recived_date);
    console.log(od.order_track.order_recived_date);

      return orderDate >= last30Days && orderDate <= today;
    });
    console.log(filteredLast30Days);
    

    setOrderTimeFilter(value);
    setOrderFilter({
      orderTime: filteredLast30Days,
      orderStatus: "",
    });

    return; // Exit the function early
  }

  // Handle Year-based filtering
  const filteredByYearData = orders.filter((od) => {
    console.log(od);
    
    const orderDate = od.order_track.order_recived_date;
    if (!orderDate) {
      console.warn("Order date is missing for:", od);
      return false; // Skip entries with no date
    }

    

    const year = orderDate.split('-')[0]; // Extract the year

    console.log(year === value);
    return year === value; // Compare with the selected year
  });

  setOrderFilter({
    orderTime: filteredByYearData,
    orderStatus: "",
  });

  setOrderTimeFilter(value);


};
























  // Handler to update the order status filter
  const handleOrderStatusChange = (e) => {
    const value = e.target.value;

    setOrderTimeFilter("last-30-days");

    console.log(orders);
  
  
    console.log("Selected Value:", value);

    if (value === 'all') {
      setOrderFilter({
        orderTime: "",
        orderStatus: orders,
      });
  
      setOrderStatus(value);
  
      return; // Exit the function early
    }


    if (value === 'processed') {


      const filteredByStatusData = orders.filter((od) => {
        console.log(od);
        
        const orderStatus = od.order_status.order_status;
        if (!orderStatus) {
          console.warn("Order status is missing for:", od);
          return false; // Skip entries with no date
        }
    
        
    
    
        console.log(orderStatus === "processed" || orderStatus === "shipped" || orderStatus === "received");
        return orderStatus === "processed" || orderStatus === "shipped" || orderStatus === "received"; // Compare with the selected year
      });


      



      setOrderFilter({
        orderTime: "",
        orderStatus: filteredByStatusData,
      });
  
      setOrderStatus(value);
  
      return; // Exit the function early
    }

    // processed
  
    // Handle Year-based filtering
    const filteredByStatusData = orders.filter((od) => {
      console.log(od);
      
      const orderStatus = od.order_status.order_status;
      if (!orderStatus) {
        console.warn("Order status is missing for:", od);
        return false; // Skip entries with no date
      }
  
      
  
  
      console.log(orderStatus === value);
      return orderStatus === value; // Compare with the selected year
    });
  
    setOrderFilter({
      orderTime: "",
      orderStatus: filteredByStatusData,
    });
  
    setOrderStatus(value);





  };













  // Handler for the start date of the custom date range
  const handleCustomDateChange = (e) => {
    setStartDate(e.target.value);
    setOrderFilter({ type: 'custom', startDate: e.target.value, endDate, status: orderStatus });
  };

  // Handler for the end date of the custom date range
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setOrderFilter({ type: 'custom', startDate, endDate: e.target.value, status: orderStatus });
  };

  return (
    <aside className="w-72 h-2/5 bg-white p-6 border-r border-gray-200">
      <h2 className="text-xl font-thin text-black border-b-2 mb-6">Filters</h2>
      
      {/* Order Status Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-[14px] ">Order Status</label>
        <select
          className="w-full py-1 px-2 border border-gray-300 rounded-md "
          value={orderStatus} 
          onChange={handleOrderStatusChange} // Update order status on change
        >
          <option value="all" className='text-[15px]'>All</option>
          <option value="processed" className='text-[15px]'>On the way</option>
          <option value="completed" className='text-[15px]'>Completed</option>
          <option value="cancelled" className='text-[15px]'>Cancelled</option>
        </select>
      </div>

      {/* Order Time Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-[14px]">Order Time</label>
        <select
          className="w-full py-1 px-2 border border-gray-300 rounded-lg"
          value={orderTimeFilter}
          onChange={handleOrderTimeChange}
        >
          <option value="last-30-days" className='text-[15px]'>Last 30 days</option>
          <option value="2025" className='text-[15px]'>2025</option>
          <option value="2024" className='text-[15px]'>2024</option>

        </select>
      </div>

    </aside>
  );
};

export default OrderBar;
