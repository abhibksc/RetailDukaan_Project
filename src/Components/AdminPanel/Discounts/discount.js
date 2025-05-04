import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getAllLooseVarient } from "../../../CrudOperations/GetOperation";
import { DeleteLooseVarient } from "../../../CrudOperations/DeleteOperation";
import AddLooseVarient from "./AddLooseVarient";
import { BiFilter } from "react-icons/bi";

const discount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLooseVarientList, setFilteredLooseVarientList] = useState([]);
  const [LooseVarientList, setLooseVarientList] = useState([]);
  const [isWarehouseModalOpen, setisWarehouseModalOpen] = useState(false);
  const [warehouse, setWareHouse] = useState("");

  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getAllLooseVarient();
      if (
        response.data.message === "All loose_variant retrieved successfully!"
      ) {
        setLooseVarientList(response.data.data);
        setFilteredLooseVarientList(response.data.data);
      }
    };
    fetchBrands();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = LooseVarientList.filter(
      (p) =>
        p.quantity.toLowerCase().includes(query) ||
        p.unit_of_measure.toLowerCase().includes(query) ||
        p.item_description.toLowerCase().includes(query)
    );
    setFilteredLooseVarientList(filteredList);
  };

  const handleDeleteBrand = async (id) => {
    const previousLooseVarientList = [...LooseVarientList];
    const updatedList = LooseVarientList.filter((p) => p.id !== id);
    setLooseVarientList(updatedList);
    setFilteredLooseVarientList(updatedList);

    try {
      const response = await DeleteLooseVarient(id);
      if (response.data.message === "loose_stock deleted successfully") {
        toast.success("loose_stock deleted successfully");
      } else {
        setLooseVarientList(previousLooseVarientList);
        setFilteredLooseVarientList(previousLooseVarientList);
        toast.error("Failed to delete loose_stock. Please try again.");
      }
    } catch (error) {
      setLooseVarientList(previousLooseVarientList);
      setFilteredLooseVarientList(previousLooseVarientList);
      toast.error("Error deleting Brand.");
    }
  };

  const handleUpdateBrand = async (id) => {
    const Item = LooseVarientList.find((p) => p.id === id);
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

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Loose Varients</h1>

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
          <FontAwesomeIcon icon={faPlus} /> Add Brand
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "SKU ID",
                "Brand",
                "Variety Name",
                "Quantity",
                "Unit",
                "Price",
                "Order Limit",
                "Warehouse",
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
            {filteredLooseVarientList.length > 0 ? (
              filteredLooseVarientList.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{p.sku_id}</td>
                  <td className="py-3 px-4 text-center">{p.brand_name}</td>
                  <td className="py-3 px-4 text-center">{p.variety_name}</td>
                  <td className="py-3 px-4 text-center">{p.quantity}</td>
                  <td className="py-3 px-4 text-center">{p.quantity_unit}</td>
                  <td className="py-3 px-4 text-center">{p.price}</td>
                  <td className="py-3 px-4 text-center">{p.limit_per_order}</td>

                  <td className="py-3 px-4 text-center cursor-pointer">
                    <button
                      onClick={() => handleWarehouseClick(p.warehouse_name)}
                      className="text-blue-500"
                    >
                      <BiFilter />
                    </button>
                  </td>

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
                  No Brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Brand Modal */}
      {isModalOpen && <AddLooseVarient closeModal={closeModal} Brand={edit} />}

      {/* Warehouse Modal */}
      {isWarehouseModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Warehouse</h2>
            <p className="text-lg font-inter mb-4">{warehouse}</p>
            <button
              onClick={() => setisWarehouseModalOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default discount;
