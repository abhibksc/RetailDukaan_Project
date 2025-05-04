import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// CRUD Operations
import {
  storeloose_Varient,
  checkSkuExists,
  storeGST,
} from "../../CrudOperations/PostOperation";
import {
  UpdateGST,
  UpdateLooseVarientData,
} from "../../CrudOperations/Update&Edit";


const AddGst = ({ closeModal, onSubmit, EditGST, onUpdate }) => {
  const [gstTitle, setGstTitle] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (EditGST) {
      setGstTitle(EditGST.gst_title || "");
      setValue(EditGST.value || "");
      setStatus(EditGST.status || "");
    } else {
      // Reset form fields
      setGstTitle("");
      setValue("");
      setStatus("");
    }
  }, [EditGST]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = { gst_title: gstTitle, value, status };
    
    try {
      let response;
      if (EditGST) {
        response = await UpdateGST({ id: EditGST.id, formData });
        if (response.data.message === "gst updated successfully!") {
          onUpdate(); // Trigger update callback
        }
      } else {
        response = await storeGST({ formData });
        if (response.data.message === "gst saved successfully!") {
          // const newGst = { ...formData, id: response.data.data.id };
          onSubmit(); // Trigger submit callback
        }
      }
      toast.success("GST saved successfully!");
    } catch (error) {
      toast.error("Failed to save GST. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg p-4 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-3">
          {EditGST ? "Edit GST" : "Add GST"}
        </h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <label className="block text-gray-700">GST Title</label>
            <input
              type="text"
              value={gstTitle}
              onChange={(e) => setGstTitle(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            >
              <option value="">Select</option>
              <option value="active">Active</option>
              <option value="not_active">Not Active</option>
            </select>
          </div>

          <div className="mb-2 col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              {EditGST ? "Update" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGst;
