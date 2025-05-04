import { useState, useEffect } from "react";
import { AddSupplier } from "../CrudOperations/PostOperation";
import { toast } from "react-toastify";
import { UpdateSupplier } from "../CrudOperations/Update&Edit";

const AddSupplierModal = ({ closeModal, onSubmit, supplier,onUpdate }) => {
console.log(closeModal);
console.log(onSubmit);
console.log(supplier);


  
  const [Supplier_Name, setSupplier_Name] = useState("");
  const [Mobile_Number, setMobile_Number] = useState("");
  const [Email, setEmail] = useState("");
  const [Company_Address, setCompany_Address] = useState("");
  const [Fssai_number, setFssai_number] = useState("");
  const [GSTIN, setGSTIN] = useState("");
  const [State_Name, setState_Name] = useState("");
  const [Code, setCode] = useState("");

  // Populate fields if a supplier is being edited
  useEffect(() => {
    if (supplier) {
      setSupplier_Name(supplier.Supplier_Name);
      setMobile_Number(supplier.Mobile_Number);
      setEmail(supplier.Email);
      setCompany_Address(supplier.Company_Address);
      setFssai_number(supplier.Fssai_number);
      setGSTIN(supplier.GSTIN);
      setState_Name(supplier.State_Name);
      setCode(supplier.Code);
    } else {
      // Clear fields if adding a new supplier
      setSupplier_Name("");
      setMobile_Number("");
      setEmail("");
      setCompany_Address("");
      setFssai_number("");
      setGSTIN("");
      setState_Name("");
      setCode("");
    }
  }, [supplier]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      Email,
      Supplier_Name,
      Mobile_Number,
      Company_Address,
      Fssai_number,
      GSTIN,
      State_Name,
      Code,
    };
    console.log(formData);

    console.log(supplier);
    
    

    try {
      let response;
      if (supplier) {
        console.log(supplier);
        // Update existing supplier
        response = await UpdateSupplier({id: supplier.id, formData});
        console.log(response);
        
        if (response.data.message === "Supplier updated successfully") {
          onUpdate(formData); // Handle updated data
        }
      } else {
        // Add new supplier
        console.log(supplier);
        response = await AddSupplier({formData});
        if (response.data.message === "Supplier saved successfully!") {
          const newSupplier = { ...formData, id: response.data.data.id };
          onSubmit(newSupplier); // Handle new data
        }
        else{
          re
        }
      }
      closeModal();
    } catch (error) {
      toast.error("Failed to save Supplier. Please try again.");
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 ${'block' }`}>
      <div className="bg-white rounded-lg p-4 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-3">
          {supplier ? "Edit Supplier" : "Add Supplier"}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700">Supplier Name *</label>
            <input
              type="text"
              value={Supplier_Name}
              onChange={(e) => setSupplier_Name(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              value={Mobile_Number}
              onChange={(e) => setMobile_Number(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Company Address</label>
            <input
              type="text"
              value={Company_Address}
              onChange={(e) => setCompany_Address(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Fssai Number</label>
            <input
              type="text"
              value={Fssai_number}
              onChange={(e) => setFssai_number(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">GSTIN</label>
            <input
              type="text"
              value={GSTIN}
              onChange={(e) => setGSTIN(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-gray-700">State Name</label>
              <input
                type="text"
                value={State_Name}
                onChange={(e) => setState_Name(e.target.value)}
                className="border border-gray-300 p-1 w-full rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Code</label>
              <input
                type="text"
                value={Code}
                onChange={(e) => setCode(e.target.value)}
                className="border border-gray-300 p-1 w-full rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 px-3 py-1 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              {supplier ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
