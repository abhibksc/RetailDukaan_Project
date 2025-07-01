import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  get_Warehouse_Stock,
  getAllPacketStock,
  getAllStockItem,
} from "../../CrudOperations/GetOperation";
import { DeletePacketStock } from "../../CrudOperations/DeleteOperation";
import AddPacketStock from "./Packet/AddPacketStock";

const ViewStock = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStockList, setFilteredStockList] = useState([]);
  const [StockList, setStockList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");

  const [warehouseDetails, setWarehouse_Details] = useState({
    warehouse_id: "",
    warehouse_name: "",
    warehouse_pin_code: "",
    warehouse_unique_id: "",
  });

  const navigate = useNavigate();

  const { warehouse_unique_id } = useParams();

  useEffect(() => {
    if (warehouse_unique_id) {
      const fetchBrands = async () => {
        const response = await get_Warehouse_Stock(
          "packet_stock",
          warehouse_unique_id
        );

        console.log(response);

        if (
          response.data.message === "All packet_stock retrieved successfully!"
        ) {
          setStockList(response.data.data);
          setFilteredStockList(response.data.data);
          setWarehouse_Details(response.data.warehouse);
        }
      };
      fetchBrands();
    } else {
      toast.warn("Warehouse not availabel yet!!");
    }
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = StockList.filter((p) =>
      p.packetvariantName.toLowerCase().includes(query)
    );
    setFilteredStockList(filteredList);
  };

  const handleDelete_packetStock = async (id) => {
    const previousStockList = [...StockList];
    const previousFilteredStockList = [...filteredStockList];

    const updatedList = StockList.filter((p) => p.id !== id);
    setStockList(updatedList);
    setFilteredStockList(updatedList);

    try {
      const response = await DeletePacketStock(id);
      if (response.data.message === "packet_stock deleted successfully") {
        toast.success("packet_stock deleted successfully");
      } else {
        setStockList(previousStockList);
        setFilteredStockList(previousFilteredStockList);
        toast.error("Failed to delete packet_stock. Please try again.");
      }
    } catch (error) {
      setStockList(previousStockList);
      setFilteredStockList(previousFilteredStockList);
      toast.error("Error deleting packet_stock.");
    }
  };

  // handleUpdateBrand

  const handleUpdate_packetStock = async (id) => {};

  const confirmChangeStatus = async () => {
    if (currentBrandId !== null) {
      // Update status in StockList
      setStockList((prevList) =>
        prevList.map((item) =>
          item.id === currentBrandId ? { ...item, Status: newStatus } : item
        )
      );

      // Update status in filteredStockList
      setFilteredStockList((prevList) =>
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

  const handleEditpacketStockformClick = (p = null) => {
    setIsModalOpen(true);

    if (p) {
      setEdit(p);
    }
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
        setStockList(response.data.data);
        setFilteredStockList(response.data.data);
      }

      setBrand("");
      toast.success("packet_stock added successfully!");
    }
  };

  const handleUpdate = async (newBrand) => {
    console.log("Updated Brand:", newBrand);
    console.log("Editing Brand ID:", edit.id);
    console.log("Brand List:", StockList);

    const response = await getAllPacketStock();
    if (response.data.message === "All packet_stock retrieved successfully!") {
      setStockList(response.data.data);
      setFilteredStockList(response.data.data);
    }

    setBrand("");
    toast.success("packet_stock updated successfully!");

    setEdit(null);
    closeModal(); // Close the modal after updating
  };

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredStockList(StockList);
      return;
    }

    const filteredList = StockList.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredStockList(filteredList);
  };

  //     const [warehouseDetails, setWarehouse_Details] = useState({

  //     warehouse_id : "",
  // warehouse_name : "",
  // warehouse_pin_code : "",
  // warehouse_unique_id : ""

  //   });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className=" mx-auto p-8 bg-white h-full rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-2xl font-bold text-gray-800 font-inter pb-3  flex items-center gap-4">
        <span className="text-blue-700">📦 Packet Stocks</span>
        {warehouseDetails?.warehouse_name && (
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-4 py-1 rounded-full shadow-sm">
            {warehouseDetails.warehouse_name}
          </span>
        )}
      </h1>

      <div className="flex flex-wrap items-center gap-4 border-b-4 border-blue-600 pb-3 mb-8 text-gray-800">
        {warehouseDetails?.warehouse_unique_id && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">🏷️ ID:</span>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded-md">
              {warehouseDetails.warehouse_unique_id}
            </span>
          </div>
        )}

        {warehouseDetails?.warehouse_pin_code && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">📮 Pincode:</span>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded-md">
              {warehouseDetails.warehouse_pin_code}
            </span>
          </div>
        )}
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInput}
            className=" border border-gray-300 p-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedDate(value);
              if (value === "") {
                setFilteredStockList(StockList); // Reset if cleared
              } else {
                const filtered = StockList.filter((item) => {
                  const itemDate = new Date(item.Entry_date)
                    .toISOString()
                    .split("T")[0];
                  return itemDate === value;
                });
                setFilteredStockList(filtered);
              }
            }}
            className="border border-gray-300 p-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleEditpacketStockformClick}
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
                "S.no",
                "purchase item id",
                "Name",
                "Stock Type",
                "Quantity",
                "Purchase_Date",
                "Entry date",
                //   "History",
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
            {console.log(filteredStockList)}
            {filteredStockList.length > 0 ? (
              filteredStockList.map((p, index) => (
                <tr
                  key={p.stock_id}
                  className="border-b transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4 text-center">
                    {p.purchase_item_id}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.packetvariantName}
                  </td>
                  <td className="py-3 px-4 text-center">{p.stock_type}</td>
                  <td className="py-3 px-4 text-center">
                    {p.quantity} {p.unit}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {formatDate(p.purchaseDate)}{" "}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {formatDate(p.Entry_date)}{" "}
                  </td>

                  {/* <td className="py-3 px-4 text-center cursor-pointer text-blue-500">click</td> */}

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleEditpacketStockformClick(p)}
                      className="text-red-500 transition-colors duration-200 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete_packetStock(p.stock_id)}
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
        <AddPacketStock
          closeModal={closeModal}
          onSubmit={handleSubmit}
          StockList={StockList}
          EditPacket_Stock={edit}
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

export default ViewStock;
