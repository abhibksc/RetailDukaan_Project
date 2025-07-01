const SummaryTotals = ({ summaryTotals }) => {
  return (
      <div className="mt-6 p-5">
        <h4 className="text-lg font-semibold mb-4">Summary Totals</h4>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block font-medium">Taxable Amount:</label>
            <input
              type="text"
              
              value=
                   {"₹"  + Number(summaryTotals.totalTaxableAmount?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              // {`₹${summaryTotals.totalTaxableAmount}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium">CGST:</label>
            <input
              type="text"
              value=
                {"₹"  + Number(summaryTotals.cgst?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              // {`₹${summaryTotals.cgst}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium">SGST:</label>
            <input
              type="text"
              value=
                  {"₹"  + Number(summaryTotals.sgst?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              // {`₹${summaryTotals.sgst}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">IGST:</label>
            <input
              type="text"
              value=
                {"₹"  + Number(summaryTotals.igst?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Discount:</label>
            <input
              type="text"
              value=
                {"₹"  + Number(summaryTotals.discount?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium">Total Amount:</label>
            <input
              type="text"
              value=
                {"₹"  + Number(summaryTotals.totalAmount?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Round Off:</label>
            <input
              type="text"
              value=
                {"₹"  + Number(summaryTotals.roundOff?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Round Off Value:</label>
            <input
              type="text"
              value=
                {"₹"  + Number(summaryTotals.roundOff_Value?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Payment:</label>
            <input
              type="text"
              value=
                {"₹"  + Number(summaryTotals.payment?.toString().replace(/[^\d.]/g, "") || 0).toLocaleString("en-IN")}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>
        </div>
      </div>
  );
};

export default SummaryTotals;
