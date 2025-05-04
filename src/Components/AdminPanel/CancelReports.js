import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchCancelReports, updateCancelStatus } from '../redux/deliverySlice';

const CancelReports = () => {
  const dispatch = useDispatch();

  // Dummy data for canceled deliveries
  const [canceledDeliveries, setCanceledDeliveries] = useState([
    {
      id: 1,
      date: '2023-07-01',
      deliveryExecutive: 'John Doe',
      items: ['Apples', 'Bananas'],
      address: '123 Main St, Springfield',
      pincode: '123456',
      amount: '500',
    },
    {
      id: 2,
      date: '2023-07-02',
      deliveryExecutive: 'Jane Smith',
      items: ['Tomatoes', 'Potatoes'],
      address: '456 Elm St, Shelbyville',
      pincode: '654321',
      amount: '300',
    },
    // Add more dummy data as needed
  ]);

  const [filter, setFilter] = useState('daily'); // default filter

  useEffect(() => {
    // dispatch(fetchCancelReports(filter));
  }, [dispatch, filter]);

  // Placeholder functions for filter changes
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Example filter logic (you can replace this with real filtering based on time frames)
  const filteredDeliveries = canceledDeliveries.filter((delivery) => {
    const today = new Date();
    const deliveryDate = new Date(delivery.date);
    if (filter === 'daily') {
      return deliveryDate.toDateString() === today.toDateString();
    }
    if (filter === 'monthly') {
      return deliveryDate.getMonth() === today.getMonth() && deliveryDate.getFullYear() === today.getFullYear();
    }
    // Add more filters as needed
    return true;
  });

  return (
    <div className="container mx-auto p-4 bg-white rounded-md shadow-lg shadow-gray-500">
      <h1 className="text-2xl font-bold mb-4">Cancel Reports</h1>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter by:</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
          <option value="executive">By Executive</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Order ID</th>
              <th className="py-2 px-4 border-b text-left">Delivery Date</th>
              <th className="py-2 px-4 border-b text-left">Delivery Executive</th>
              <th className="py-2 px-4 border-b text-left">Items</th>
              <th className="py-2 px-4 border-b text-left">Address</th>
              <th className="py-2 px-4 border-b text-left">Pincode</th>
              <th className="py-2 px-4 border-b text-left">Amount</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td className="py-2 px-4 border-b">{delivery.id}</td>
                <td className="py-2 px-4 border-b">{delivery.date}</td>
                <td className="py-2 px-4 border-b">{delivery.deliveryExecutive}</td>
                <td className="py-2 px-4 border-b">{delivery.items.join(', ')}</td>
                <td className="py-2 px-4 border-b">{delivery.address}</td>
                <td className="py-2 px-4 border-b">{delivery.pincode}</td>
                <td className="py-2 px-4 border-b">{delivery.amount}</td>
                <td className="py-2 px-4 border-b">Cancelled</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CancelReports;
