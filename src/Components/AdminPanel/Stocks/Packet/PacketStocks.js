import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getAllPacketStock, getAllStockItem } from "../../../CrudOperations/GetOperation";
import { DeletePacketStock } from "../../../CrudOperations/DeleteOperation";
import AddPacketStock from "./AddPacketStock";



const PacketStocks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLooseStockList, setFilteredLooseStockList] = useState([]);
  const [LooseStockList, setLooseStockList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getAllPacketStock();
      if (response.data.message === "All packet_stock retrieved successfully!") {
        setLooseStockList(response.data.data);
        setFilteredLooseStockList(response.data.data);
      }
    };
    fetchBrands();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = LooseStockList.filter(
      (p) =>
        p.quantity.toLowerCase().includes(query) ||
        p.unit_of_measure.toLowerCase().includes(query) ||
        p.ItemName.toLowerCase().includes(query)
    );
    setFilteredLooseStockList(filteredList);
  };


  const handleDeleteBrand = async (id) => {
    const previousLooseStockList = [...LooseStockList];
    const previousFilteredLooseStockList = [...filteredLooseStockList];

    const updatedList = LooseStockList.filter((p) => p.id !== id);
    setLooseStockList(updatedList);
    setFilteredLooseStockList(updatedList);

    try {
      const response = await DeletePacketStock(id);
      if (response.data.message === "packet_stock deleted successfully") {
        toast.success("packet_stock deleted successfully");
      } else {
        setLooseStockList(previousLooseStockList);
        setFilteredLooseStockList(previousFilteredLooseStockList);
        toast.error("Failed to delete packet_stock. Please try again.");
      }
    } catch (error) {
      setLooseStockList(previousLooseStockList);
      setFilteredLooseStockList(previousFilteredLooseStockList);
      toast.error("Error deleting packet_stock.");
    }
  };

  // handleUpdateBrand

  const handleUpdateBrand = async (p) => {


   // const Item = LooseStockList.find((p) => p.id === id);

   const purchaseStock = await getAllStockItem();
   console.log(purchaseStock);
   console.log(p);


   if(purchaseStock.data.message == "Stockitems retrieved successfully!"){

     const data = purchaseStock.data.data.find((ele) => ele.id == p.purchase_item_id);
     console.log(data);

     const form = {
       item : p,
       available : data.AvailableQuantity,
       unit_name :  data.unit_name,
       unit_id :  data.unit_id
     }

     console.log(form);

     
   setEdit(form);

   setIsModalOpen(true);
     
     



   }

  };


  const confirmChangeStatus = async () => {
    if (currentBrandId !== null) {
      // Update status in LooseStockList
      setLooseStockList((prevList) =>
        prevList.map((item) =>
          item.id === currentBrandId ? { ...item, Status: newStatus } : item
        )
      );

      // Update status in filteredLooseStockList
      setFilteredLooseStockList((prevList) =>
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

  const handleSubmit = async(newBrand) => {
    console.log(newBrand);

    if(newBrand){

      const response = await getAllPacketStock();
      if (response.data.message === "All packet_stock retrieved successfully!") {
        setLooseStockList(response.data.data);
        setFilteredLooseStockList(response.data.data);
      }

      
    setBrand("");
    toast.success("packet_stock added successfully!");
    }
  };

  const handleUpdate = async(newBrand) => {
    console.log("Updated Brand:", newBrand);
    console.log("Editing Brand ID:", edit.id);
    console.log("Brand List:", LooseStockList);

   
    const response = await getAllPacketStock();
    if (response.data.message === "All packet_stock retrieved successfully!") {
      setLooseStockList(response.data.data);
      setFilteredLooseStockList(response.data.data);
    }

    
  setBrand("");
  toast.success("packet_stock updated successfully!");

    setEdit(null);
    closeModal(); // Close the modal after updating
  };



  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredLooseStockList(LooseStockList);
      return;
    }

    const filteredList = LooseStockList.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredLooseStockList(filteredList);
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
      Packet Stocks
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
                 "Item",
                 "quantity",
                 "unit_of_measure",
                 // "price",
                 // "rate_per_unit",
                 // "Edit",
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
            {console.log(filteredLooseStockList)}
            
            {filteredLooseStockList.length > 0 ? (
              filteredLooseStockList.map((p) => (
                <tr
                key={p.id}
                className="border-b transition-colors duration-200 hover:bg-gray-50"
              >
                       {/* <td className="py-3 px-4 text-center">{p.stock_type}</td> */}
                <td className="py-3 px-4 text-center">{p.packetvariantName || p.loosevariantName}</td>
                <td className="py-3 px-4 text-center">{p.quantity}</td>
                <td className="py-3 px-4 text-center">{p.unit}</td>


                {/* <td className="py-3 px-4 text-center">{p.price}</td> */}


{/*                
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleUpdateBrand(p)}
                    className="text-blue-500 transition-colors duration-200 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </td> */}

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

      {/* Add Brand Modal */}
      {isModalOpen && (
        <AddPacketStock
          closeModal={closeModal}
          onSubmit={handleSubmit}
          LooseStockList={LooseStockList}
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

export default PacketStocks;
