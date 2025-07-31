import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DeletePacketStock } from "../../../CrudOperations/DeleteOperation";
import {
  getAllPacketStock,
  getAllStockItem,
} from "../../../CrudOperations/GetOperation";
import AddLooseStocks from "./AddLooseStocks";

const LooseStocks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWarehouse_Stock_List, setFilteredWarehouse_Stock_List] =
    useState([]);
  const [Warehouse_Stock_List, setWarehouse_Stock_List] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getAllPacketStock();
      if (
        response?.data?.message === "All packet_stock retrieved successfully!"
      ) {
        setWarehouse_Stock_List(response.data.data);
        setFilteredWarehouse_Stock_List(response.data.data);
      }
    };
    fetchBrands();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = Warehouse_Stock_List.filter(
      (p) =>
        p.quantity.toLowerCase().includes(query) ||
        p.unit_of_measure.toLowerCase().includes(query) ||
        p.ItemName.toLowerCase().includes(query)
    );
    setFilteredWarehouse_Stock_List(filteredList);
  };

  const handleDeleteBrand = async (id) => {
    console.log(id);

    const previousWarehouse_Stock_List = [...Warehouse_Stock_List];
    const previousFilteredWarehouse_Stock_List = [
      ...filteredWarehouse_Stock_List,
    ];

    const updatedList = Warehouse_Stock_List.filter(
      (p) => p.warehouse_id !== id
    );
    setWarehouse_Stock_List(updatedList);
    setFilteredWarehouse_Stock_List(updatedList);

    try {
      const response = await DeletePacketStock(id);
      if (response.data.message === "packet_stock deleted successfully") {
        toast.success("packet_stock deleted successfully");
      } else {
        setWarehouse_Stock_List(previousWarehouse_Stock_List);
        setFilteredWarehouse_Stock_List(previousFilteredWarehouse_Stock_List);
        toast.error("Failed to delete packet_stock. Please try again.");
      }
    } catch (error) {
      setWarehouse_Stock_List(previousWarehouse_Stock_List);
      setFilteredWarehouse_Stock_List(previousFilteredWarehouse_Stock_List);
      toast.error("Error deleting packet_stock.");
    }
  };

  // handleUpdateBrand

  const handleUpdateBrand = async (p) => {
    // const Item = Warehouse_Stock_List.find((p) => p.id === id);

    const purchaseStock = await getAllStockItem();
    console.log(purchaseStock);
    console.log(p);

    if (purchaseStock.data.message == "Stockitems retrieved successfully!") {
      const data = purchaseStock.data.data.find(
        (ele) => ele.id == p.purchase_item_id
      );
      console.log(data);

      const form = {
        item: p,
        available: data.AvailableQuantity,
        unit_name: data.unit_name,
        unit_id: data.unit_id,
      };

      console.log(form);

      setEdit(form);

      setIsModalOpen(true);
    }
  };

  const confirmChangeStatus = async () => {
    if (currentBrandId !== null) {
      // Update status in Warehouse_Stock_List
      setWarehouse_Stock_List((prevList) =>
        prevList.map((item) =>
          item.id === currentBrandId ? { ...item, Status: newStatus } : item
        )
      );

      // Update status in filteredWarehouse_Stock_List
      setFilteredWarehouse_Stock_List((prevList) =>
        prevList.map((item) =>
          item.id === currentBrandId ? { ...item, Status: newStatus } : item
        )
      );

      try {
        const response = await UpdateBrandStatus({
          id: currentBrandId,
          Status: newStatus,
        });
        if (response.data.message === "packet_stock updated successfully!") {
          toast.success(`packet_stock updated to ${newStatus} successfully!`);
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

  const handleSubmit = async (newBrand) => {
    console.log(newBrand);

    if (newBrand) {
      const response = await getAllPacketStock();
      if (
        response.data.message === "All packet_stock retrieved successfully!"
      ) {
        setWarehouse_Stock_List(response.data.data);
        setFilteredWarehouse_Stock_List(response.data.data);
      }

      setBrand("");
      toast.success("packet_stock added successfully!");
    }
  };

  const handleUpdate = async (newBrand) => {
    console.log("Updated Brand:", newBrand);
    console.log("Editing Brand ID:", edit.id);
    console.log("Brand List:", Warehouse_Stock_List);

    const response = await getAllPacketStock();
    if (response.data.message === "All packet_stock retrieved successfully!") {
      setWarehouse_Stock_List(response.data.data);
      setFilteredWarehouse_Stock_List(response.data.data);
    }

    setBrand("");
    toast.success("packet_stock updated successfully!");

    setEdit(null);
    closeModal(); // Close the modal after updating
  };

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredWarehouse_Stock_List(Warehouse_Stock_List);
      return;
    }

    const filteredList = Warehouse_Stock_List.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredWarehouse_Stock_List(filteredList);
  };

  return (
    <div className="h-full  mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
        Loose Stocks
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className=" border border-gray-300 p-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleAddBrandformClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-500 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add
          </button>
        </div>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                //  "stock_type",
                "WareHouse Unique Id",
                "WareHouse Name",
                "Area Pin",
                "Stock",
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
            {console.log(filteredWarehouse_Stock_List)}

            {filteredWarehouse_Stock_List.length > 0 ? (
              filteredWarehouse_Stock_List.map((p) => (
                <tr
                  key={p.warehouse_id}
                  className="border-b transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-center">
                    {p.warehouse_unique_id}
                  </td>
                  <td className="py-3 px-4 text-center">{p.warehouse_name}</td>
                  <td className="py-3 px-4 text-center">
                    {p.warehouse_pin_code}
                  </td>
                  <td
                    className="py-3 px-4 text-center text-blue-500 cursor-pointer"
                    onClick={() =>
                      window.open(
                        `/admin/${localStorage.getItem(
                          "Merchanttoken"
                        )}/looseStock/view/${p.warehouse_unique_id}`,
                        "_blank"
                      )
                    }
                  >
                    click
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteBrand(p.warehouse_id)}
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

      {/* Add Brand Modal */}
      {isModalOpen && (
        <AddLooseStocks
          closeModal={closeModal}
          onSubmit={handleSubmit}
          Warehouse_Stock_List={Warehouse_Stock_List}
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

export default LooseStocks;
