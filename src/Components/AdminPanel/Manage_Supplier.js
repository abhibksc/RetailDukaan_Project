import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { AddSupplier } from "../CrudOperations/PostOperation";
import { getAllSupplier } from "../CrudOperations/GetOperation";
import { DeleteSupplier } from "../CrudOperations/DeleteOperation";
import AddSupplierModal from "./AddSupplierModal";
import { UpdateSupplier } from "../CrudOperations/Update&Edit";
import AddSupplierModal from "./AddSupplierModal";

const Manage_Supplier = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Supplier, setSupplier] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSupplierList, setFilteredSupplierList] = useState([]);
  const [SupplierList, setSupplierList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentSupplierId, setCurrentSupplierId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await getAllSupplier();
      if (response.data.message === "All Supplier retrieved successfully!") {
        setSupplierList(response.data.data);
        setFilteredSupplierList(response.data.data);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = SupplierList.filter(
      (p) =>
        p.Code.toLowerCase().includes(query) ||
        p.Company_Address.toLowerCase().includes(query) ||
        p.Email.toLowerCase().includes(query) ||
        p.Fssai_number.toLowerCase().includes(query) ||
        p.Mobile_Number.toLowerCase().includes(query) ||
        p.GSTIN.toLowerCase().includes(query) ||
        p.State_Name.toLowerCase().includes(query) ||
        p.Supplier_Name.toLowerCase().includes(query)
    );
    setFilteredSupplierList(filteredList);
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (Supplier) {
      const response = await AddSupplier({ Supplier });
      if (response.data.message === "Supplier saved successfully!") {
        const newSupplier = { Supplier, id: response.data.data.id };
        setSupplierList([...SupplierList, newSupplier]);
        setFilteredSupplierList([...filteredSupplierList, newSupplier]);
        setSupplier("");
        toast.success("Supplier added successfully!");
      } else {
        toast.error("Failed to add Supplier. Please try again.");
      }
    } else {
      toast.error("Please enter a valid Supplier.");
    }
  };

  const handleDeleteSupplier = async (id) => {
    const previousSupplierList = [...SupplierList];
    const previousFilteredSupplierList = [...filteredSupplierList];

    const updatedList = SupplierList.filter((p) => p.id !== id);
    setSupplierList(updatedList);
    setFilteredSupplierList(updatedList);

    try {
      const response = await DeleteSupplier(id);
      if (response.data.message === "Supplier deleted successfully") {
        toast.success("Supplier deleted successfully");
      } else {
        setSupplierList(previousSupplierList);
        setFilteredSupplierList(previousFilteredSupplierList);
        toast.error("Failed to delete Supplier. Please try again.");
      }
    } catch (error) {
      setSupplierList(previousSupplierList);
      setFilteredSupplierList(previousFilteredSupplierList);
      toast.error("Error deleting Supplier.");
    }
  };

  // handleUpdateSupplier

  const handleUpdateSupplier = async (id) => {
    const previousSupplierList = [...SupplierList];
    const previousFilteredSupplierList = [...filteredSupplierList];

    const Item = SupplierList.find((p) => p.id === id);

    setEdit(Item);

    setIsModalOpen(true);
  };

  const handleCheckboxChange = (id, isChecked) => {
    // Set the current Supplier ID and the new status based on the checkbox state
    setCurrentSupplierId(id);
    setNewStatus(isChecked ? "Available" : "Not Available");
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const confirmChangeStatus = async () => {
    if (currentSupplierId !== null) {
      // Update status in SupplierList
      setSupplierList((prevList) =>
        prevList.map((item) =>
          item.id === currentSupplierId ? { ...item, Status: newStatus } : item
        )
      );

      // Update status in filteredSupplierList
      setFilteredSupplierList((prevList) =>
        prevList.map((item) =>
          item.id === currentSupplierId ? { ...item, Status: newStatus } : item
        )
      );

      try {
        const response = await UpdateSupplierStatus({
          id: currentSupplierId,
          Status: newStatus,
        });
        if (response.data.message === "Supplier updated successfully!") {
          toast.success(`Status updated to ${newStatus} successfully!`);
        } else {
          toast.error("Error updating status.");
        }
      } catch (error) {
        toast.error("Error updating status.");
      } finally {
        setIsConfirmModalOpen(false); // Close the confirmation modal
        setCurrentSupplierId(null); // Reset the ID
      }
    }
  };

  const handleAddSupplierformClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (newSupplier) => {
    console.log(newSupplier);

    setSupplierList([...SupplierList, newSupplier]);
    setFilteredSupplierList([...filteredSupplierList, newSupplier]);
    setSupplier("");
    toast.success("Supplier added successfully!");
  };

  const handleUpdate = (newSupplier) => {
    console.log("Updated Supplier:", newSupplier);
    console.log("Editing Supplier ID:", edit.id);
    console.log("Supplier List:", SupplierList);

    setSupplierList((prev) =>
      prev.map((prevSupplier) =>
        prevSupplier.id === edit.id
          ? {
              ...prevSupplier, // Keep existing properties
              ...newSupplier, // Merge properties from newSupplier
            }
          : prevSupplier
      )
    );

    setFilteredSupplierList((prev) =>
      prev.map((prevSupplier) =>
        prevSupplier.id === edit.id
          ? {
              ...prevSupplier,
              ...newSupplier,
            }
          : prevSupplier
      )
    );

    setEdit(null);
    closeModal(); // Close the modal after updating
  };

  useEffect(() => {
    console.log(SupplierList);
  }, [SupplierList]);

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredSupplierList(SupplierList);
      return;
    }

    const filteredList = SupplierList.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredSupplierList(filteredList);
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
        Manage Supplier
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-1/2 border border-gray-300 p-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleAddSupplierformClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-500 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Supplier Name",
                "Mobile Number",
                "Email",
                "Company Address",
                "Fssai Number",
                "GSTIN",
                "State Name",
                "Code",
                "Edit",
                "Delete",
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-center font-semibold text-gray-700"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSupplierList.length > 0 ? (
              filteredSupplierList.map((p) => (
                <tr
                  key={p.id}
                  className="border-b transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-center">{p.Supplier_Name}</td>
                  <td className="py-3 px-4 text-center">{p.Mobile_Number ? p.Mobile_Number : "null"}</td>
                  <td className="py-3 px-4 text-center">{p.Email}</td>
                  <td className="py-3 px-4 text-center">{p.Company_Address}</td>
                  <td className="py-3 px-4 text-center">{p.Fssai_number}</td>
                  <td className="py-3 px-4 text-center">{p.GSTIN}</td>
                  <td className="py-3 px-4 text-center">{p.State_Name}</td>
                  <td className="py-3 px-4 text-center">{p.Code}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleUpdateSupplier(p.id)}
                      className="text-blue-500 transition-colors duration-200 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteSupplier(p.id)}
                      className="text-red-500 transition-colors duration-200 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-3 text-center text-gray-600">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <AddSupplierModal
          closeModal={closeModal}
          onSubmit={handleSubmit}
          supplier={edit}
          onUpdate={handleUpdate}
        />
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Change Status</h2>
            <p>
              Are you sure you want to change the status to{" "}
              {newStatus === "Not Available" ? "Not Accessible" : "Accessible"}?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmChangeStatus}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
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

export default Manage_Supplier;
