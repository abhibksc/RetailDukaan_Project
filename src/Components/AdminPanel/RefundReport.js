import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RefundReport = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch refund data from API
    axios.get('/api/refunds')
      .then(response => {
        setRefunds(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching refund data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Refund Report</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Transaction ID</th>
                <th className="px-4 py-2 border-b">Customer Name</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Reason</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map(refund => (
                <tr key={refund.id}>
                  <td className="px-4 py-2 border-b">{refund.date}</td>
                  <td className="px-4 py-2 border-b">{refund.transactionId}</td>
                  <td className="px-4 py-2 border-b">{refund.customerName}</td>
                  <td className="px-4 py-2 border-b">${refund.amount}</td>
                  <td className={`px-4 py-2 border-b ${refund.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>{refund.status}</td>
                  <td className="px-4 py-2 border-b">{refund.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RefundReport;
