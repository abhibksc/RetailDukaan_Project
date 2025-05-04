import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SalesDetails = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Fetch sales data for the particular admin
    // For demonstration, let's use some mock data
    const fetchSalesData = async () => {
      // Replace with actual API call
      const data = [
        {
          id: 1,
          date: '2024-08-01 10:00 AM',
          customerName: 'John Doe',
          productService: 'Product 1',
          quantity: 10,
          totalAmount: 100,
          paymentMethod: 'Credit Card',
          orderStatus: 'Completed',
          salesRep: 'Alice Smith',
          discount: '10% OFF',
          shippingMethod: 'Standard',
          shippingCost: '$5',
          profitMargin: '$20',
          tax: '$8',
          customerLocation: 'New York, USA',
          orderNotes: 'Leave at the front door.',
          returnStatus: 'No Returns'
        },
        {
          id: 2,
          date: '2024-08-02 11:30 AM',
          customerName: 'Jane Doe',
          productService: 'Product 2',
          quantity: 5,
          totalAmount: 50,
          paymentMethod: 'PayPal',
          orderStatus: 'Pending',
          salesRep: 'Bob Johnson',
          discount: 'None',
          shippingMethod: 'Express',
          shippingCost: '$10',
          profitMargin: '$15',
          tax: '$4',
          customerLocation: 'Los Angeles, USA',
          orderNotes: 'Call on arrival.',
          returnStatus: 'No Returns'
        },
        {
          id: 3,
          date: '2024-08-03 02:15 PM',
          customerName: 'Alice Cooper',
          productService: 'Product 3',
          quantity: 7,
          totalAmount: 70,
          paymentMethod: 'Cash',
          orderStatus: 'Cancelled',
          salesRep: 'Charlie Davis',
          discount: '5% OFF',
          shippingMethod: 'Standard',
          shippingCost: '$7',
          profitMargin: '$18',
          tax: '$6',
          customerLocation: 'Chicago, USA',
          orderNotes: 'Deliver to the back door.',
          returnStatus: 'Refunded'
        }
      ];
      setSalesData(data);
      setFilteredSalesData(data);
    };

    fetchSalesData();
  }, []);

  // Calculate total sales amount
  const totalSalesAmount = filteredSalesData.reduce((total, sale) => total + sale.totalAmount, 0);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter sales data based on the search query
    const filteredData = salesData.filter((sale) => {
      return (
        sale.customerName.toLowerCase().includes(query) ||
        sale.productService.toLowerCase().includes(query) ||
        sale.date.toLowerCase().includes(query) ||
        sale.paymentMethod.toLowerCase().includes(query) ||
        sale.orderStatus.toLowerCase().includes(query) ||
        sale.salesRep.toLowerCase().includes(query) ||
        sale.customerLocation.toLowerCase().includes(query)
      );
    });

    setFilteredSalesData(filteredData);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sales Details</h2>
        <h3 className="text-xl font-semibold text-gray-700">Total Sales: ${totalSalesAmount}</h3>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          placeholder="Search by Customer Name, Product, Date, Payment Method, etc."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Order ID</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Customer Name</th>
              <th className="py-2 px-4 border-b text-left">Product/Service</th>
              <th className="py-2 px-4 border-b text-left">Quantity</th>
              <th className="py-2 px-4 border-b text-left">Total Amount</th>
              <th className="py-2 px-4 border-b text-left">Payment Method</th>
              <th className="py-2 px-4 border-b text-left">Order Status</th>
              <th className="py-2 px-4 border-b text-left">Sales Representative</th>
              <th className="py-2 px-4 border-b text-left">Discount/Promotion</th>
              <th className="py-2 px-4 border-b text-left">Shipping Method</th>
              <th className="py-2 px-4 border-b text-left">Shipping Cost</th>
              <th className="py-2 px-4 border-b text-left">Profit Margin</th>
              <th className="py-2 px-4 border-b text-left">Tax</th>
              <th className="py-2 px-4 border-b text-left">Customer Location</th>
              <th className="py-2 px-4 border-b text-left">Order Notes</th>
              <th className="py-2 px-4 border-b text-left">Return/Refund Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesData.map((sale) => (
              <tr key={sale.id}>
                <td className="py-2 px-4 border-b">{sale.id}</td>
                <td className="py-2 px-4 border-b">{sale.date}</td>
                <td className="py-2 px-4 border-b">{sale.customerName}</td>
                <td className="py-2 px-4 border-b">{sale.productService}</td>
                <td className="py-2 px-4 border-b">{sale.quantity}</td>
                <td className="py-2 px-4 border-b">${sale.totalAmount}</td>
                <td className="py-2 px-4 border-b">{sale.paymentMethod}</td>
                <td className="py-2 px-4 border-b">{sale.orderStatus}</td>
                <td className="py-2 px-4 border-b">{sale.salesRep}</td>
                <td className="py-2 px-4 border-b">{sale.discount}</td>
                <td className="py-2 px-4 border-b">{sale.shippingMethod}</td>
                <td className="py-2 px-4 border-b">{sale.shippingCost}</td>
                <td className="py-2 px-4 border-b">{sale.profitMargin}</td>
                <td className="py-2 px-4 border-b">{sale.tax}</td>
                <td className="py-2 px-4 border-b">{sale.customerLocation}</td>
                <td className="py-2 px-4 border-b">{sale.orderNotes}</td>
                <td className="py-2 px-4 border-b">{sale.returnStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDetails;
