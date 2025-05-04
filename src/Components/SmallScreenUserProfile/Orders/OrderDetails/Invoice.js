import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';


// Define the Invoice component
const Invoice = () => {
  const generatePDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
    <div class="p-8 border rounded-md shadow-md max-w-3xl mx-auto bg-white">
      <h1 class="text-center text-2xl font-bold mb-6">Tax Invoice / Bill of Supply</h1>
      <div class="space-y-2">
        <p><strong>Sold By:</strong> Shreyash Retail Private Limited</p>
        <p><strong>Ship Address:</strong> Dag No. 910, 911, 912, 901, 902, 900, 671(part), 899, 670, 683, 684, 685, 686, 687, 688, 689, 704, 705, 666, 667, 668, 669, 664, 665, 707, 706, 708, 711, 658, 659, 663, 662, 661, 660, 655, 654, 652, 653, 656, 657, 637, 636, situated at Mauza Kapasaria and Jayakrishnapur, P.S. Chanditala Block- Chanditala II, Chinsurah, Hooghly District, Kolkata, WEST BENGAL, India - 712306, IN-WB</p>
        <p><strong>GSTIN:</strong> 19AAXCS0655F1ZV</p>
        <p><strong>FSSAI License No:</strong> 13321999000230</p>
      </div>
      <div class="flex justify-between mt-4">
        <div>
          <p><strong>Ship To:</strong> (Your Shipping Address)</p>
        </div>
        <div>
          <p><strong>Bill To:</strong> (Your Billing Address)</p>
        </div>
      </div>

      <table class="w-full mt-4 table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th class="border p-2 text-left">S. No</th>
            <th class="border p-2 text-left">Item</th>
            <th class="border p-2 text-left">HSN (Tax%)</th>
            <th class="border p-2 text-left">Qty</th>
            <th class="border p-2 text-left">MRP (Rs)</th>
            <th class="border p-2 text-left">Savings (Rs)</th>
            <th class="border p-2 text-left">Total Amt (Rs)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border p-2">1</td>
            <td className="border p-2">Cadbury Oreo Biscuit Vanilla Flavour Cream Sandwich Biscuit, 125.25 g</td>
            <td className="border p-2">19053100 (18.0)</td>
            <td className="border p-2">1</td>
            <td className="border p-2">40.00</td>
            <td className="border p-2">9.00</td>
            <td className="border p-2">31.00</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-6">
        <p><strong>Summary:</strong></p>
        <p>You have SAVED Rs. 9.00 on this order.</p>
        <p><strong>Total Amount (Food):</strong> 31.00</p>
        <p><strong>Total Amount (Non-Food):</strong> 0.00</p>
        <p><strong>Delivery Charges:</strong> 0.00</p>
        <p><strong>Grand Total:</strong> 31.00</p>
      </div>

      <div class="mt-6">
        <p><strong>Tax break-up:</strong></p>
        <table class="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th class="border p-2 text-left">GST%</th>
              <th class="border p-2 text-left">Taxable Amount</th>
              <th class="border p-2 text-left">IGST</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2">18.00</td>
              <td class="border p-2">26.27</td>
              <td class="border p-2">4.73</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6">
        <p><strong>Delivery Charges:</strong> 42.37</p>
        <p><strong>Grand Total:</strong> 26.27 (Taxable) + 4.73 (IGST)</p>
      </div>

      <div class="mt-8 text-center">
        <p>Shreyash Retail Private Limited</p>
        <p>Signature</p>
        <p>Authorized Signatory</p>
      </div>
    </div>
    `;
    html2pdf().from(element).save('invoice.pdf');
  };

  return (
    <div>
      <button
        onClick={generatePDF}
        className="mt-4 px-4 py-2 shadow-lg border-2 border-blue-200 text-blue-500 rounded hover:shadow-xl  focus:outline-none"
      >
        Download
      </button>
    </div>
  );
};

export default Invoice;
