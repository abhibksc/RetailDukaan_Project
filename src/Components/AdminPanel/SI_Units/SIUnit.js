import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getAllUnit } from "../../CrudOperations/GetOperation";
import { Deleteunit } from "../../CrudOperations/DeleteOperation";
import AddunitModal from "./addunitModal";


const SIUnit = () => {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unit, setUnit] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredunitList, setFilteredunitList] = useState([]);
  const [unitList, setunitList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentunitId, setCurrentunitId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");

  useEffect(() => {
    const fetchunit = async () => {
      const response = await getAllUnit();
      if (response.data.message === "All unit retrieved successfully!") {
        setunitList(response.data.data);
        setFilteredunitList(response.data.data);
      }
    };
    fetchunit();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = unitList.filter(
      (p) =>
        p.unit.toLowerCase().includes(query)
    );
    setFilteredunitList(filteredList);
  };


  const handleDeleteunit = async (id) => {
    const previousunitList = [...unitList];
    const previousFilteredunitList = [...filteredunitList];

    const updatedList = unitList.filter((p) => p.id !== id);
    setunitList(updatedList);
    setFilteredunitList(updatedList);

    try {
      const response = await Deleteunit(id);
      if (response.data.message === "Unit deleted successfully!") {
        toast.success("Unit deleted successfully!");
      } else {
        setunitList(previousunitList);
        setFilteredunitList(previousFilteredunitList);
        toast.error("Failed to delete unit. Please try again.");
      }
    } catch (error) {
      setunitList(previousunitList);
      setFilteredunitList(previousFilteredunitList);
      toast.error("Error deleting unit.");
    }
  };

  // handleUpdateunit

  const handleUpdateunit = async (id) => {
    const previousunitList = [...unitList];
    const previousFilteredunitList = [...filteredunitList];

    const Item = unitList.find((p) => p.id === id);

    setEdit(Item);

    setIsModalOpen(true);
  };

  const handleCheckboxChange = (id, isChecked) => {
    // Set the current unit ID and the new status based on the checkbox state
    setCurrentunitId(id);
    setNewStatus(isChecked ? "Available" : "Not Available");
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const confirmChangeStatus = async () => {
    if (currentunitId !== null) {
      // Update status in unitList
      setunitList((prevList) =>
        prevList.map((item) =>
          item.id === currentunitId ? { ...item, Status: newStatus } : item
        )
      );

      // Update status in filteredunitList
      setFilteredunitList((prevList) =>
        prevList.map((item) =>
          item.id === currentunitId ? { ...item, Status: newStatus } : item
        )
      );

      try {
        const response = await Updateunittatus({
          id: currentunitId,
          Status: newStatus,
        });
        if (response.data.message === "unit updated successfully!") {
          toast.success(`Status updated to ${newStatus} successfully!`);
        } else {
          toast.error("Error updating status.");
        }
      } catch (error) {
        toast.error("Error updating status.");
      } finally {
        setIsConfirmModalOpen(false); // Close the confirmation modal
        setCurrentunitId(null); // Reset the ID
      }
    }
  };

  const handleAddunitformClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (newunit) => {
    console.log(newunit);

    setunitList([...unitList, newunit]);
    setFilteredunitList([...filteredunitList, newunit]);
    setUnit("");
    toast.success("unit added successfully!");
  };

  const handleUpdate = async(newunit) => {

    const response2 = await getAllUnit();
    if (response2.data.message === "All unit retrieved successfully!") {
      setunitList(response2.data.data);
      setFilteredunitList(response2.data.data);
    }


    if(newunit){
      console.log("Updated unit:", newunit);
      console.log("Editing unit ID:", edit.id);
      console.log("unit List:", unitList);
  
      setunitList((prev) =>
        prev.map((prevunit) =>
          prevunit.id === edit.id
            ? {
                ...prevunit, // Keep existing properties
                ...newunit, // Merge properties from newunit
              }
            : prevunit
        )
      );
  
      setFilteredunitList((prev) =>
        prev.map((prevunit) =>
          prevunit.id === edit.id
            ? {
                ...prevunit,
                ...newunit,
              }
            : prevunit
        )
      );
  
      setEdit(null);
   



      closeModal(); // Close the modal after updating


    }


  };

  useEffect(() => {
    console.log(unitList);
  }, [unitList]);

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredunitList(unitList);
      return;
    }

    const filteredList = unitList.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredunitList(filteredList);
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
        Manage unit
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
            onClick={handleAddunitformClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-500 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add unit
          </button>
        </div>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "S.no",
                "unit_id",
                "Unit",
                "Value",
                "parent_id",
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
            {filteredunitList.length > 0 ? (
              filteredunitList.map((p,index) => (
                <tr
                  key={p.id}
                  className="border-b transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-center">{index+1}</td>
                  <td className="py-3 px-4 text-center">{p.id}</td>

                  <td className="py-3 px-4 text-center">{p.unit}</td>
                  <td className="py-3 px-4 text-center">{p.value}</td>
                  <td className="py-3 px-4 text-center">{p.parent_id ? p.parent_id : "null"}</td>

               
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleUpdateunit(p.id)}
                      className="text-blue-500 transition-colors duration-200 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteunit(p.id)}
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
                  No unit found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add unit Modal */}
      {isModalOpen && (
    <AddunitModal
        closeModal={closeModal}
        onSubmit={handleSubmit}
        UnitData={edit}
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

export default SIUnit;
