import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ViewDetails = () => {
  const location = useLocation();
  let data = location.state;

  useEffect(() => {
    if (data) {
      console.log("Raw Data:", data);
      data = {
        ...data,
        payment: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(Number(data.payment || 0)),
      };
    } else {
      console.warn("No data received!");
    }
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-purple-100 to-blue-50 rounded-lg shadow-xl">
      <h1 className="text-3xl font-extrabold mb-6 border-b pb-2 text-indigo-900">
        🧾 Invoice Details
      </h1>

      {/* Invoice Number */}
      <div className="mb-6 w-fit border-b pb-2">
        <label className="text-lg text-indigo-700 font-semibold">Invoice No:</label>
        <div className="text-xl font-medium text-indigo-900">{data.invoiceNo || "N/A"}</div>
      </div>

      {/* Supplier Info */}
      <div className="mb-10 border-b-2 border-purple-200 pb-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-3">📦 Supplier Details</h2>
        <div className="grid grid-cols-2 gap-4 text-purple-700">
          <div><strong>Name:</strong> {data.Supplier_Name || "N/A"}</div>
          <div><strong>Contact:</strong> {data.Supplier_MobileNumber || "N/A"}</div>
          <div><strong>Address:</strong> {data.Supplier_Address || "N/A"}</div>
          <div><strong>GSTIN:</strong> {data.Supplier_Gstin || "N/A"}</div>
        </div>
      </div>

      {/* Item Details */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-3">🛍️ Item Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-blue-200 rounded shadow">
            <thead className="bg-blue-100">
              <tr>
                {[
                  "Name",
                  "HSN",
                  "Purchased Qty",
                  "Available Qty",
                  "Selling Price",
                  "Unit",
                  "Mfg Date",
                  "Expiry Date",
                  "Cost/Unit",
                  "Total Cost",
                  "Discount",
                  "Line Total",
                  "GST",
                  "Final Total",
                ].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-2 text-blue-800 font-semibold border"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((item, i) => {
                const name =
                  item.variantName ||
                  item.ItemName ||
                  item.LooseVariantName ||
                  item.PacketVariantName ||
                  "N/A";

                const finalTotal = (
                  Number(item.Line_Total || 0) + Number(item.gstAmount || 0)
                ).toFixed(2);

                return (
                  <tr
                    key={i}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="text-center px-3 py-2">{name}</td>
                    <td className="text-center px-3 py-2">{item.HSN || "-"}</td>
                    <td className="text-center px-3 py-2">{item.quantity || "0"}</td>
                    <td className="text-center px-3 py-2">{item.AvailableQuantity || "0"}</td>
                    <td className="text-center px-3 py-2">₹{item.sellingPrice || "0"}</td>
                    <td className="text-center px-3 py-2">{item.Unit_Name || "-"}</td>
                    <td className="text-center px-3 py-2">{item.mfgDate || "-"}</td>
                    <td className="text-center px-3 py-2">{item.expiryDate || "-"}</td>
                    <td className="text-center px-3 py-2">₹{item.cost_per_unit || "0"}</td>

                                      <td className="text-center px-3 py-2">
                       ₹{Number(item.Totalcost?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
                      </td>


                    <td className="text-center px-3 py-2">₹{item.discount || "0"}</td>
                    <td className="text-center px-3 py-2">
                       ₹{Number(item.Line_Total?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
                      </td>
                    <td className="text-center px-3 py-2">₹{item.gstAmount || "0"}</td>
                    <td className="text-center px-3 py-2 font-semibold text-green-700">
                         ₹{Number(finalTotal?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}</td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-teal-800 mb-3">💳 Payment Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-teal-300 rounded shadow">
            <thead className="bg-teal-100">
              <tr>
                <th className="py-3 px-4 text-center font-semibold text-teal-700">Invoice No.</th>
                <th className="py-3 px-4 text-center font-semibold text-teal-700">Date</th>
                <th className="py-3 px-4 text-center font-semibold text-teal-700"> Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center hover:bg-teal-50">
                <td className="py-3 px-4">{data.invoiceNo}</td>
                <td className="py-3 px-4">{data.date}</td>
                <td className="py-3 px-4 font-semibold text-green-800"> 

                   ₹{Number(data.payment?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Total */}
 <div className="w-fit flex items-center gap-4 mt-4">
  <label className="text-lg text-green-700 font-semibold whitespace-nowrap">
    💰 Grand Total:
  </label>
  <div className="text-xl font-bold text-green-800 bg-green-50 px-3 py-1 rounded shadow">
    ₹{   Number(data.payment || 0).toLocaleString("en-IN")    }
  </div>
</div>

    </div>
  );
};

export default ViewDetails;
