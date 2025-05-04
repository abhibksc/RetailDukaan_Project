import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const DeliveryReports = () => {
  const dispatch = useDispatch();
  const [reportType, setReportType] = useState('Day');

  // Dummy data
  const deliveries = [
    {
      id: 1,
      date: '2024-07-25',
      status: 'Delivered',
      deliveryExecutive: 'Alice Johnson',
      items: ['Apples', 'Bananas', 'Carrots'],
      address: '123 Maple St, Springfield',
      pincode: '123456',
      amount: '750',
    },
    {
      id: 2,
      date: '2024-06-02',
      status: 'Cancelled',
      deliveryExecutive: 'Bob Smith',
      items: ['Tomatoes', 'Potatoes', 'Onions'],
      address: '456 Oak St, Shelbyville',
      pincode: '654321',
      amount: '500',
    },
    {
      id: 3,
      date: '2024-06-15',
      status: 'Delivered',
      deliveryExecutive: 'Charlie Brown',
      items: ['Oranges', 'Grapes', 'Lettuce'],
      address: '789 Pine St, Capital City',
      pincode: '789123',
      amount: '600',
    },
    {
      id: 4,
      date: '2024-07-01',
      status: 'Delivered',
      deliveryExecutive: 'Diana Prince',
      items: ['Milk', 'Bread', 'Butter'],
      address: '321 Cedar St, Ogdenville',
      pincode: '456789',
      amount: '300',
    },
    {
      id: 5,
      date: '2024-07-05',
      status: 'Cancelled',
      deliveryExecutive: 'Edward Stark',
      items: ['Eggs', 'Cheese', 'Yogurt'],
      address: '654 Birch St, North Haverbrook',
      pincode: '987654',
      amount: '400',
    },
    {
      id: 6,
      date: '2024-07-10',
      status: 'Delivered',
      deliveryExecutive: 'Fiona Gallagher',
      items: ['Chicken', 'Rice', 'Beans'],
      address: '987 Elm St, Riverdale',
      pincode: '123789',
      amount: '550',
    },
    {
      id: 7,
      date: '2024-08-01',
      status: 'Out for Delivery',
      deliveryExecutive: 'George Lucas',
      items: ['Fish', 'Pasta', 'Tomato Sauce'],
      address: '159 Oak Ave, Sunnyside',
      pincode: '456123',
      amount: '700',
    },
    {
      id: 8,
      date: '2024-08-15',
      status: 'Delivered',
      deliveryExecutive: 'Helen Carter',
      items: ['Beef', 'Potatoes', 'Onions'],
      address: '753 Maple Ave, Dreamland',
      pincode: '321654',
      amount: '800',
    },
    {
      id: 9,
      date: '2024-09-01',
      status: 'Pending',
      deliveryExecutive: 'Ivan Reyes',
      items: ['Eggplant', 'Zucchini', 'Bell Peppers'],
      address: '852 Cedar Ave, Pleasantville',
      pincode: '987321',
      amount: '650',
    },
    {
      id: 10,
      date: '2024-09-15',
      status: 'Delivered',
      deliveryExecutive: 'Jane Doe',
      items: ['Yogurt', 'Granola', 'Honey'],
      address: '741 Pine Ave, Lakeside',
      pincode: '456987',
      amount: '450',
    }
  ];
  
  useEffect(() => {
    // dispatch(fetchDeliveries());
  }, [dispatch]);

  const handleStatusChange = (deliveryId, status) => {
    // dispatch(updateDeliveryStatus({ deliveryId, status }));
  };

  // Dummy date functions for demonstration purposes
  const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startOfQuarter = (date) => new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
  const endOfQuarter = (date) => new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3 + 3, 0);
  const startOfYear = (date) => new Date(date.getFullYear(), 0, 1);
  const endOfYear = (date) => new Date(date.getFullYear(), 11, 31);

  const filterData = (deliveries, type) => {
    const now = new Date();

    switch (type) {
      case 'Day':
        return deliveries.filter(d => new Date(d.date).toDateString() === now.toDateString());
      case 'Date':
        return deliveries.filter(d => new Date(d.date).toDateString() === now.toDateString());
      case 'Monthly':
        return deliveries.filter(d =>
          new Date(d.date) >= startOfMonth(now) && new Date(d.date) <= endOfMonth(now)
        );
      case 'Quarterly':
        return deliveries.filter(d =>
          new Date(d.date) >= startOfQuarter(now) && new Date(d.date) <= endOfQuarter(now)
        );
      case 'Yearly':
        return deliveries.filter(d =>
          new Date(d.date) >= startOfYear(now) && new Date(d.date) <= endOfYear(now)
        );
      case 'Delivery Executive':
        return deliveries; // For the delivery executive view, no special filtering
      default:
        return deliveries;
    }
  };

  const groupedDeliveries = (deliveries) => {
    if (reportType === 'Delivery Executive') {
      return deliveries.reduce((acc, curr) => {
        if (!acc[curr.deliveryExecutive]) {
          acc[curr.deliveryExecutive] = [];
        }
        acc[curr.deliveryExecutive].push(curr);
        return acc;
      }, {});
    }
    return deliveries;
  };

  const filteredDeliveries = filterData(deliveries, reportType);
  const displayedDeliveries = groupedDeliveries(filteredDeliveries);

  console.log('Filtered Deliveries:', filteredDeliveries);
  console.log('Grouped Deliveries:', displayedDeliveries);

  return (
    <div className="container mx-auto p-4 bg-white rounded-md shadow-lg shadow-gray-500">
      <h1 className="text-2xl font-bold mb-4">Delivery Reports</h1>
      <div className="mb-4">
        <label htmlFor="report-type" className="mr-2">Report Type:</label>
        <select
          id="report-type"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Day">Day</option>
          <option value="Date">Date</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
          <option value="Delivery Executive">Delivery Executive</option>
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
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(displayedDeliveries) ? (
              displayedDeliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="py-2 px-4 border-b">{delivery.id}</td>
                  <td className="py-2 px-4 border-b">{delivery.date}</td>
                  <td className="py-2 px-4 border-b">{delivery.deliveryExecutive}</td>
                  <td className="py-2 px-4 border-b">{delivery.items.join(', ')}</td>
                  <td className="py-2 px-4 border-b">{delivery.address}</td>
                  <td className="py-2 px-4 border-b">{delivery.pincode}</td>
                  <td className="py-2 px-4 border-b">{delivery.amount}</td>
                  <td className="py-2 px-4 border-b">{delivery.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleStatusChange(delivery.id, 'Delivered')}
                      className="text-blue-500 hover:underline"
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              Object.entries(displayedDeliveries).map(([executive, deliveries]) => (
                deliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td className="py-2 px-4 border-b">{delivery.id}</td>
                    <td className="py-2 px-4 border-b">{delivery.date}</td>
                    <td className="py-2 px-4 border-b">{executive}</td>
                    <td className="py-2 px-4 border-b">{delivery.items.join(', ')}</td>
                    <td className="py-2 px-4 border-b">{delivery.address}</td>
                    <td className="py-2 px-4 border-b">{delivery.pincode}</td>
                    <td className="py-2 px-4 border-b">{delivery.amount}</td>
                    <td className="py-2 px-4 border-b">{delivery.status}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleStatusChange(delivery.id, 'Delivered')}
                        className="text-blue-500 hover:underline"
                      >
                        Mark as Delivered
                      </button>
                    </td>
                  </tr>
                ))
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryReports;
