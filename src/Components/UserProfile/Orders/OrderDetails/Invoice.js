import React, { useState } from 'react';

const Invoice = ({ orderID }) => {
  const [invoiceData, setInvoiceData] = useState(null);

  const fetchInvoice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }

    try {
      const response = await fetch(`https://retaildukan.wipenex.com/public/api/getInvoice/${orderID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch invoice");

      const data = await response.json();
      setInvoiceData(data); // Store the invoice data
    } catch (error) {
      console.log("Error fetching invoice:", error);
    }
  };

  const generatePDF = async () => {
    
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }

    try {
      const response = await fetch(`https://retaildukan.wipenex.com/public/api/getInvoice/${orderID}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor to trigger download
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `invoice_${orderID}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Clean up URL object
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Fetch Invoice Data */}
      <button
        onClick={fetchInvoice}
        className="mt-4 px-4 py-2 shadow-lg border-2 border-blue-200 text-blue-500 rounded hover:shadow-xl focus:outline-none"
      >
        Fetch Invoice
      </button>

      {/* Download PDF */}
      <button
        onClick={generatePDF}
        className="mt-4 ml-2 px-4 py-2 shadow-lg border-2 border-green-200 text-green-500 rounded hover:shadow-xl focus:outline-none"
      >
        Download PDF
      </button>

      {/* Invoice Details */}
      {invoiceData && (
        <div className="mt-6 p-4 border rounded-md shadow-md max-w-3xl mx-auto bg-white">
          <h1 className="text-center text-2xl font-bold mb-6">Tax Invoice / Bill of Supply</h1>
          <p><strong>Sold By:</strong> Shreyash Retail Private Limited</p>
          <p><strong>Order ID:</strong> {orderID}</p>
          <p><strong>Grand Total:</strong> ₹{invoiceData.grandTotal ?? 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default Invoice;
