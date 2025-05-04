import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchCustomerMails, updateMailStatus } from '../redux/mailSlice';

const CustomerMails = () => {
  const dispatch = useDispatch();

  // Dummy data for customer mails
  const [customerMails, setCustomerMails] = useState([
    {
      id: 1,
      date: '2023-07-01',
      customerName: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Issue with order #1234',
      message: 'I have an issue with my order #1234.',
      status: 'Pending',
    },
    {
      id: 2,
      date: '2023-07-02',
      customerName: 'Jane Smith',
      email: 'jane.smith@example.com',
      subject: 'Product inquiry',
      message: 'Can you provide more details about product #5678?',
      status: 'Pending',
    },
    // Add more dummy data as needed
  ]);

  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    // dispatch(fetchCustomerMails());
  }, [dispatch]);

  const handleStatusChange = (mailId, status) => {
    // dispatch(updateMailStatus({ mailId, status }));
    // For dummy data, update the status locally
    setCustomerMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, status } : mail
      )
    );
  };

  const filteredMails = filterStatus === 'All'
    ? customerMails
    : customerMails.filter(mail => mail.status === filterStatus);

  return (
    <div className="container mx-auto p-4  rounded-md shadow-lg bg-white">
      <h1 className="text-3xl font-bold  mb-4">Customer Mails</h1>
      <div className="flex justify-between mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 bg-white border rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Replied">Replied</option>
        </select>
      </div>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg ">
        <table className="min-w-full bg-white border border-gray-200 rounded-md ">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-2 px-4 border-b text-left">Mail ID</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Customer Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Subject</th>
              <th className="py-2 px-4 border-b text-left">Message</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMails.map((mail) => (
              <tr key={mail.id} className="hover:bg-gray-100 transition-colors ">
                <td className="py-2 px-4 border-b">{mail.id}</td>
                <td className="py-2 px-4 border-b">{mail.date}</td>
                <td className="py-2 px-4 border-b">{mail.customerName}</td>
                <td className="py-2 px-4 border-b">{mail.email}</td>
                <td className="py-2 px-4 border-b">{mail.subject}</td>
                <td className="py-2 px-4 border-b">{mail.message}</td>
                <td className="py-2 px-4 border-b">{mail.status}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={mail.status}
                    onChange={(e) => handleStatusChange(mail.id, e.target.value)}
                    className="p-2 border rounded bg-gray-50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Replied">Replied</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerMails;
