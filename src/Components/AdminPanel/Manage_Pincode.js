import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { AddPinCode } from "../CrudOperations/PostOperation";
import { getAllPincode } from "../CrudOperations/GetOperation";
import { Deletepincode } from "../CrudOperations/DeleteOperation";
import AddPinCodeModal from "./AddPinCodeModal";
import { UpdatePinCodeStatus } from "../CrudOperations/Update&Edit";

const Manage_Pincode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPincodeList, setFilteredPincodeList] = useState([]);
  const [pincodeList, setPincodeList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentPincodeId, setCurrentPincodeId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchPincodes = async () => {
      const response = await getAllPincode();
      if (response.data.message === "All pincodes retrieved successfully!") {
        setPincodeList(response.data.data);
        setFilteredPincodeList(response.data.data);
      }
    };
    fetchPincodes();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = pincodeList.filter(
      (p) =>
        p.pincode.toLowerCase().includes(query) ||
        p.district_name.toLowerCase().includes(query) ||
        p.state_name.toLowerCase().includes(query) ||
        p.country_name.toLowerCase().includes(query)
    );
    setFilteredPincodeList(filteredList);
  };

  const handleAddPincode = async (e) => {
    e.preventDefault();
    if (pincode) {
      const response = await AddPinCode({ pincode });
      if (response.data.message === "Pincode saved successfully!") {
        const newPincode = { pincode, id: response.data.data.id };
        setPincodeList([...pincodeList, newPincode]);
        setFilteredPincodeList([...filteredPincodeList, newPincode]);
        setPincode("");
        toast.success("Pincode added successfully!");
      } else {
        toast.error("Failed to add pincode. Please try again.");
      }
    } else {
      toast.error("Please enter a valid pincode.");
    }
  };

  const handleDeletePincode = async (id) => {
    const previousPincodeList = [...pincodeList];
    const previousFilteredPincodeList = [...filteredPincodeList];
  
    const updatedList = pincodeList.filter((p) => p.id !== id);
    setPincodeList(updatedList);
    setFilteredPincodeList(updatedList);
  
    try {
      const response = await Deletepincode(id);
      if (response.data.message === "Pincode and related entries deleted successfully!") {
        toast.success("Pincode deleted successfully!");
      } else {
        setPincodeList(previousPincodeList);
        setFilteredPincodeList(previousFilteredPincodeList);
        toast.error("Failed to delete pincode. Please try again.");
      }
    } catch (error) {
      setPincodeList(previousPincodeList);
      setFilteredPincodeList(previousFilteredPincodeList);
      toast.error("Error deleting pincode.");
    }
  };

  const handleCheckboxChange = (id, isChecked) => {
    // Set the current pincode ID and the new status based on the checkbox state
    setCurrentPincodeId(id);
    setNewStatus(isChecked ? "Available" : "Not Available");
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const confirmChangeStatus = async () => {
    if (currentPincodeId !== null) {
      // Update status in pincodeList
      setPincodeList((prevList) =>
        prevList.map((item) =>
          item.id === currentPincodeId ? { ...item, Status: newStatus } : item
        )
      );

      // Update status in filteredPincodeList
      setFilteredPincodeList((prevList) =>
        prevList.map((item) =>
          item.id === currentPincodeId ? { ...item, Status: newStatus } : item
        )
      );

      try {
        const response = await UpdatePinCodeStatus({ id: currentPincodeId, Status: newStatus });
        if (response.data.message === "Pincode updated successfully!") {
          toast.success(`Status updated to ${newStatus} successfully!`);
        } else {
          toast.error("Error updating status.");
        }
      } catch (error) {
        toast.error("Error updating status.");
      } finally {
        setIsConfirmModalOpen(false); // Close the confirmation modal
        setCurrentPincodeId(null); // Reset the ID
      }
    }
  };

  const handleAddPincodeformClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (newPincode) => {
    console.log(newPincode);
    
    setPincodeList([...pincodeList, newPincode]);
    setFilteredPincodeList([...filteredPincodeList, newPincode]);
    setPincode("");
    toast.success("Pincode added successfully!");
  };

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredPincodeList(pincodeList);
      return;
    }

    const filteredList = pincodeList.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredPincodeList(filteredList);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <h1 className="text-lg font-inter font-bold mb-6 border-b-4 border-blue-500 pb-2 text-gray-700">
        Manage Pin Code
      </h1>

      <div className="mb-6 w-full flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Pincode..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="border border-gray-300 p-3 rounded-md  transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <div className="flex items-center gap-4">
          <select
            className="shadow-md border border-gray-300 px-2 py-2 rounded-md text-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFilterChange}
          >
            <option value="">Select Area</option>
            <option value="Available">Accessible</option>
            <option value="Not Available">Not Accessible</option>
          </select>

          <button
            onClick={handleAddPincodeformClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition duration-200 transform hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-400 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white table-auto border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              Select
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              Area
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              Pincode
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              District
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              State
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              Country
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredPincodeList.length > 0 ? (
            filteredPincodeList.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={p.Status === "Available"}
                    onChange={(e) => handleCheckboxChange(p.id, e.target.checked)}
                  />
                </td>
                <td className="py-3 px-4 text-center">{p.Area}</td>
                <td className="py-3 px-4 text-center">{p.pincode}</td>
                <td className="py-3 px-4 text-center">{p.district_name}</td>
                <td className="py-3 px-4 text-center">{p.state_name}</td>
                <td className="py-3 px-4 text-center">{p.country_name}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDeletePincode(p.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-3 text-center text-gray-600">
                No pin codes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Pincode Modal */}
      {isModalOpen && (
        <AddPinCodeModal closeModal={closeModal} onSubmit={handleSubmit} />
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Confirm Change Status
            </h2>
            <p>Are you sure you want to change the status to {newStatus === "Not Available" ? "Not Accessable" : "Accessable"}?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmChangeStatus}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage_Pincode;
