import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AddBrand from "./AddBrand";
import { getAllBrand } from "../../CrudOperations/GetOperation";
import { DeleteBrand } from "../../CrudOperations/DeleteOperation";
import PaginationExample from "../../PaginationExample";

const Managebrand = () => {

     const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
        const itemsPerPage = 9; // Items per page


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBrandList, setFilteredBrandList] = useState([]);
  const [BrandList, setBrandList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getAllBrand();
      if (response.data.message === "All brands retrieved successfully!") {
        setBrandList(response.data.data);
        setFilteredBrandList(response.data.data);
      }
    };
    fetchBrands();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    console.log(BrandList);
    
    const filteredList = BrandList.filter(
      (p) =>
        p.brand_name.toLowerCase().includes(query)
    );
    setFilteredBrandList(filteredList);
  };


  const handleDeleteBrand = async (id) => {
    const previousBrandList = [...BrandList];
    const previousFilteredBrandList = [...filteredBrandList];

    const updatedList = BrandList.filter((p) => p.id !== id);
    setBrandList(updatedList);
    setFilteredBrandList(updatedList);

    try {
      const response = await DeleteBrand(id);
      if (response.data.message === "brand deleted successfully") {
        toast.success("Brand deleted successfully");
      } else {
        setBrandList(previousBrandList);
        setFilteredBrandList(previousFilteredBrandList);
        toast.error("Failed to delete Brand. Please try again.");
      }
    } catch (error) {
      setBrandList(previousBrandList);
      setFilteredBrandList(previousFilteredBrandList);
      toast.error("Error deleting Brand.");
    }
  };

  // handleUpdateBrand

  const handleUpdateBrand = async (id) => {
    const previousBrandList = [...BrandList];
    const previousFilteredBrandList = [...filteredBrandList];

    const Item = BrandList.find((p) => p.id === id);

    setEdit(Item);

    setIsModalOpen(true);
  };

  const handleCheckboxChange = (id, isChecked) => {
    // Set the current Brand ID and the new status based on the checkbox state
    setCurrentBrandId(id);
    setNewStatus(isChecked ? "Available" : "Not Available");
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const confirmChangeStatus = async () => {
    if (currentBrandId !== null) {
      // Update status in BrandList
      setBrandList((prevList) =>
        prevList.map((item) =>
          item.id === currentBrandId ? { ...item, Status: newStatus } : item
        )
      );

      // Update status in filteredBrandList
      setFilteredBrandList((prevList) =>
        prevList.map((item) =>
          item.id === currentBrandId ? { ...item, Status: newStatus } : item
        )
      );

      try {
        const response = await UpdateBrandStatus({
          id: currentBrandId,
          Status: newStatus,
        });
        if (response.data.message === "Brand updated successfully!") {
          toast.success(`Status updated to ${newStatus} successfully!`);
        } else {
          toast.error("Error updating status.");
        }
      } catch (error) {
        toast.error("Error updating status.");
      } finally {
        setIsConfirmModalOpen(false); // Close the confirmation modal
        setCurrentBrandId(null); // Reset the ID
      }
    }
  };

  const handleAddBrandformClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async() => {
    const response = await getAllBrand();
    if (response.data.message === "All brands retrieved successfully!") {
      setBrandList(response.data.data);
      setFilteredBrandList(response.data.data);
    }
    toast.success("Brand added successfully!");
  };

  const handleUpdate = (newBrand) => {
    console.log("Updated Brand:", newBrand);
    console.log("Editing Brand ID:", edit.id);
    console.log("Brand List:", BrandList);

    setBrandList((prev) =>
      prev.map((prevBrand) =>
        prevBrand.id === edit.id
          ? {
              ...prevBrand, // Keep existing properties
              ...newBrand, // Merge properties from newBrand
            }
          : prevBrand
      )
    );

    setFilteredBrandList((prev) =>
      prev.map((prevBrand) =>
        prevBrand.id === edit.id
          ? {
              ...prevBrand,
              ...newBrand,
            }
          : prevBrand
      )
    );

    setEdit(null);
    closeModal(); // Close the modal after updating
  };

  useEffect(() => {
    console.log(BrandList);
  }, [BrandList]);

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredBrandList(BrandList);
      return;
    }

    const filteredList = BrandList.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredBrandList(filteredList);
  };



    
        // Calculate the page count (total items divided by items per page)
        const pageCount = Math.ceil(filteredBrandList.length / itemsPerPage);

        // Slice the items array to only show items for the current page
        const currentItems = filteredBrandList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    
        // Handle page change
        const handlePageChange = (selectedPage) => {
            setCurrentPage(selectedPage.selected);
        };


  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
        Manage Brand
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
            onClick={handleAddBrandformClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-500 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Brand
          </button>
        </div>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Brand Name",
                "Brand Description",
                "Status",
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
            {currentItems.length > 0 ? (
              currentItems.map((p) => (
                <tr
                  key={p.id}
                  className="border-b transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-center">{p.brand_name}</td>
                  <td className="py-3 px-4 text-center">{p.brand_description || "Not Defined"}</td>
                  <td className="py-3 px-4 text-center">{p.status}</td>
               
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleUpdateBrand(p.id)}
                      className="text-blue-500 transition-colors duration-200 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteBrand(p.id)}
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
                  No Brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      
      <PaginationExample pageCount={pageCount} onPageChange={handlePageChange} />

      {/* Add Brand Modal */}
      {isModalOpen && (
        <AddBrand
          closeModal={closeModal}
          onSubmit={handleSubmit}
          Brand={edit}
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

export default Managebrand;
