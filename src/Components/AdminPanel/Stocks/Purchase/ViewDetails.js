import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ViewDetails = () => {
  const location = useLocation();
  let data = location.state;

  useEffect(() => {
    if (data) {
      console.log(data);
      data = {...data, payment : "₹" + data.payment }
      console.log(data);
      
    } else {
      console.log("Data Nahi Aaya");
    }
  }, []);

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-indigo-100 via-purple-50 to-blue-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-7 border-b-2 pb-2 text-indigo-800">View Details</h1>

      <div className="space-y-6">
        {/* Invoice Number */}
        <div className="flex flex-col mb-4 w-2/12 border-b-2 border-indigo-300">
          <label className="text-indigo-700 font-medium mb-2">Invoice No.</label>
          <input
            type="text"
            value={data.invoiceNo}
            className="border border-indigo-400 rounded p-2 bg-indigo-50 text-indigo-800"
            disabled
            readOnly
          />
        </div>

        {/* Supplier Details */}
        <div className="space-y-4 border-b-2 border-purple-300 p-2">
          <h2 className="text-2xl font-semibold text-purple-800">Supplier Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-purple-700">
              <span className="font-bold">Supplier Name:</span> {data.Supplier_Name}
            </div>
            <div className="text-purple-700">
              <span className="font-bold">Supplier Contact No.</span> : {data.Supplier_MobileNumber}
            </div>
            <div className="text-purple-700">
              <span className="font-bold">Supplier Address:</span> {data.Supplier_Address}
            </div>
            <div className="text-purple-700">
              <span className="font-bold">Supplier GST No.</span> : {data.Supplier_Gstin}
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-800">Item Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-blue-300 rounded-lg shadow-sm">
              <thead className="bg-blue-100">
                <tr className="border-b border-blue-200">
                  {[
                    "Name",
                    "HSN",
                    "Qty",
                    "Unit",
                    "Mfg. Date",
                    "Expiry Date",
                    "Cost Price/Unit",
                    "Totalcost",
                    "discount",
                    "Line Total",
                    "gstAmount",
                    "Total"
                  ].map((heading) => (
                    <th key={heading} className="py-3 px-4 text-center font-semibold text-blue-700">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((element, index) => (
                  <tr
                    key={index}
                    className="border-b border-blue-200 transition-colors duration-200 hover:bg-blue-50"
                  >
                    <td className="py-3 px-4 text-center"> {`${
                    element.variantName ? element.variantName + " (variant)" : ""
                  }` ||
                  element.ItemName ||
                    `${
                      element.LooseVariantName
                        ? element.LooseVariantName + " (variant)"
                        : ""
                    }` ||
                    `${
                      element.PacketVariantName
                        ? element.PacketVariantName + " (variant)"
                        : ""
                    }` ||
                    "No name available"}</td>
                    <td className="py-3 px-4 text-center">{element.HSN}</td>
                    <td className="py-3 px-4 text-center">{element.quantity}</td>
                    <td className="py-3 px-4 text-center">{element.Unit_Name}</td>
                    <td className="py-3 px-4 text-center">{element.mfgDate}</td>
                    <td className="py-3 px-4 text-center">{element.expiryDate}</td>
                    <td className="py-3 px-4 text-center">{element.cost_per_unit}</td>
                    <td className="py-3 px-4 text-center">{element.Totalcost}</td>
                    <td className="py-3 px-4 text-center">{element.discount}</td>
                    <td className="py-3 px-4 text-center">{element.Line_Total}</td>
                    <td className="py-3 px-4 text-center">{element.gstAmount}</td>
                    <td className="py-3 px-4 text-center">{Number(element.Line_Total ) + Number(element.gstAmount)}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-teal-800">Payment Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-teal-300 rounded-lg shadow-sm">
              <thead className="bg-teal-100">
                <tr className="border-b border-teal-200">
                  <th className="py-3 px-4 text-center font-semibold text-teal-700">Invoice No.</th>
                  <th className="py-3 px-4 text-center font-semibold text-teal-700">Invoice Date</th>
                  <th className="py-3 px-4 text-center font-semibold text-teal-700">Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-teal-200 transition-colors duration-200 hover:bg-teal-50">
                  <td className="py-3 px-4 text-center">{data.invoiceNo}</td>
                  <td className="py-3 px-4 text-center">{data.date}</td>
                  <td className="py-3 px-4 text-center">{data.payment}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex flex-col mb-4 w-52">
          <label className="text-teal-700 font-medium mb-2">Total Amount</label>
          <input
            type="text"
            value={ data.payment}
            className="border border-teal-300 rounded p-2 bg-teal-50 text-teal-800"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
