import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
// import { DeleteLooseVarient } from "../../../CrudOperations/DeleteOperation";
import { BiFilter } from "react-icons/bi";
import AddGst from "./AddGst";
import { getAllGST } from "../../CrudOperations/GetOperation";
import { DeleteLooseVarient, delteteGST } from "../../CrudOperations/DeleteOperation";

const ManageGST = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGstList, setFilteredGstList] = useState([]);
  const [GstList, setGstList] = useState([]);



  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getAllGST();
      if (
        response.data.message === "All gst retrieved successfully!"
      ) {
        setGstList(response.data.data);
        setFilteredGstList(response.data.data);
      }
    };
    fetchBrands();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);


    const filteredList = GstList.filter(
      (p) =>
        p.gst_title.toLowerCase().includes(query) ||
      p.status.toLowerCase().includes(query) ||
        p.value.toLowerCase().includes(query)
    );
    setFilteredGstList(filteredList);
  };


  const handleDeleteBrand = async (id) => {
    const previousGstList = [...GstList];
    const updatedList = GstList.filter((p) => p.id !== id);
    setGstList(updatedList);
    setFilteredGstList(updatedList);

    try {
      const response = await delteteGST(id);
      if (response.data.message === "gst  deleted successfully!") {
        toast.success("gst  deleted successfully!");
      } else {
        setGstList(previousGstList);
        setFilteredGstList(previousGstList);
        toast.error("Failed to delete gst. Please try again.");
      }
    } catch (error) {
      setGstList(previousGstList);
      setFilteredGstList(previousGstList);
      toast.error("Error deleting Brand.");
    }
  };

  const handleUpdateBrand = async (id) => {
    const Item = GstList.find((p) => p.id === id);
    setEdit(Item);
    setIsModalOpen(true);
  };

  const handleAddBrandformClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleWarehouseClick = (warehouse) => {
    setWareHouse(warehouse); // Set the warehouse
    setisWarehouseModalOpen(true); // Open the modal
  };

  const handleSubmit = async() => {

    const response = await getAllGST();
    console.log(response);
    
    if (
      response.data.message === "All gst retrieved successfully!"
    ) {
      setGstList(response.data.data);
      setFilteredGstList(response.data.data);
    }

    closeModal(); // Close the modal after updating

    
   

  };

  const handleUpdate = async() => {
    const response = await getAllGST();
    console.log(response);
    
    if (
      response.data.message === "All gst retrieved successfully!"
    ) {
      setGstList(response.data.data);
      setFilteredGstList(response.data.data);
    }
    
    setEdit(null);
    closeModal(); // Close the modal after updating

    
  toast.success("gst updated successfully!");
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">GST Rate</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-full sm:w-1/2 border p-3 rounded-md"
        />
        <button
          onClick={handleAddBrandformClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          <FontAwesomeIcon icon={faPlus} /> Add GST
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
               "s.no",
               "GST title",
               "GST value",
               "GST status",
                "Edit",
                "Delete",
              ].map((heading) => (
                <th key={heading} className="py-3 px-4 text-center">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredGstList.length > 0 ? (
              filteredGstList.map((p,index) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{index+1}</td>
                  <td className="py-3 px-4 text-center">{p.gst_title}</td>
                  <td className="py-3 px-4 text-center">{p.value}</td>
                  <td className="py-3 px-4 text-center">{p.status}</td>

               

                 

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleUpdateBrand(p.id)}
                      className="text-blue-500"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteBrand(p.id)}
                      className="text-red-500"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-3 text-center">
                  No gst found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Brand Modal */}
      {isModalOpen && (
        <AddGst
          onSubmit={handleSubmit}
          closeModal={closeModal}
          EditGST={edit}
          onUpdate={handleUpdate}
        />
      )}


    </div>
  );
};

export default ManageGST;
