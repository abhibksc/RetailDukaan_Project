import { useEffect, useState } from "react";
import { getAllSupplier } from "../../../CrudOperations/GetOperation";

const InvoiceDetailsForm = ({ invoiceDetails, handleInvoiceDetailsChange,Edit } ) => {


   const [supplierList, setsupplierList] = useState([]);
      const [loading, setLoading] = useState(false);


   useEffect(() => {
          const fun = async () => {
            setLoading(true);
            const [
              suppliersResponse,
            ] = await Promise.all([
              getAllSupplier(),
            ]);
      
      
      
            if (
              suppliersResponse.data &&
              suppliersResponse.data.message == "All Supplier retrieved successfully!"
            ) {
              console.log(suppliersResponse);
              setsupplierList(suppliersResponse.data.data);
            }
      
      
            setLoading(false);
          };
      
          fun();
        }, []);



              if(loading) return   <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
    





  return (
       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 border-b p-5">
        {/* Supplier Input */}
        <div>
          <label className="block font-medium">Supplier *</label>
          <select
            name="supplier"
            value={invoiceDetails.supplier}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          >
            <option value="">--Select Supplier--</option>
            {supplierList.map((supplier, index) => (
              <option key={index} value={supplier.id}>
                {supplier.Supplier_Name}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice Number Input */}
        <div>
          <label className="block font-medium">Invoice No *</label>
          <input
            type="text"
            name="invoiceNo"
            value={invoiceDetails.invoiceNo}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Motor Vehicle Number Input */}
        <div>
          <label className="block font-medium">Motor Vehicle No. *</label>
          <input
            type="text"
            name="MotorVehicleNo"
            value={invoiceDetails.MotorVehicleNo}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Mode of Payment Input */}
        <div>
          <label className="block font-medium">Mode of Payment *</label>
          <input
            type="text"
            name="ModeofPayment"
            value={invoiceDetails.ModeofPayment}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block font-medium">Date *</label>
          <input
            type="date"
            name="date"
            value={invoiceDetails.date}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* e-Way Bill Number Input */}
        <div>
          <label className="block font-medium">e_WayBillNo (Optional)</label>
          <input
            type="text"
            name="e_WayBillNo"
            value={invoiceDetails.e_WayBillNo}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* GST Type Checkboxes */}
        <div>
          <label className="block font-medium">GST Type</label>
          <div className="flex items-center space-x-4 mb-2">
            <label className="flex items-center">
              <input
                disabled={Edit}
                type="checkbox"
                name="cgstSgst"
                checked={invoiceDetails.cgstSgst}
                onChange={handleInvoiceDetailsChange}
                className="mr-2"
              />
              CGST/SGST
            </label>
            <label className="flex items-center">
              <input
                disabled={Edit}
                type="checkbox"
                name="igst"
                checked={invoiceDetails.igst}
                onChange={handleInvoiceDetailsChange}
                className="mr-2"
              />
              IGST
            </label>
          </div>
        </div>
      </div>
  );
};

export default InvoiceDetailsForm;
