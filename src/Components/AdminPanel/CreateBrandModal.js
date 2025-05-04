import React, { useState } from "react";
import { StoreBrand } from "../CrudOperations/PostOperation";
import { toast } from "react-toastify";

const CreateBrandModal = ({ isOpen, onClose, onSubmit }) => {
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = {
        brand_name : brandName,
        brand_description : description,
        status : status,
    };

    const  response = await StoreBrand({formData});
            if (response.data.message == 'Brand saved successfully!') {
    
       
                onSubmit(response.data.data.brand_id); // Handle new data

                
    onSubmit(formData);
    setBrandName("");
    setDescription("");
    setStatus("active");
    onClose(); // Close the modal after submission


            }
            else{

              toast.error(response.data.message)


            }


  };

  if (!isOpen) return null; // Don't render if the modal is closed

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Brand</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand Name Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter brand name"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrandModal;
