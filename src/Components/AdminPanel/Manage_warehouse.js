import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { storeWareHouse } from "../CrudOperations/PostOperation";
import { useSelector } from "react-redux";
import { GetwareHouses } from "../CrudOperations/GetOperation";
import { UpdatewareHouses } from "../CrudOperations/Update&Edit";
import { toast } from "react-toastify";
import { delterwarehouse } from "../CrudOperations/DeleteOperation";

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehouseDetails, setNewWarehouseDetails] = useState({
    role_id: "",
    warehouse_name: "",
    address: "",
    mobile_number: "",
    email: "",
    pin_code: "",
    latitude: "",
    longitude: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWarehouseId, setCurrentWarehouseId] = useState(null);
  const [expandedAddresses, setExpandedAddresses] = useState({});

  const Merchant_userId = useSelector((state) => state.auth.Merchant_userId);

  useEffect(() => {
    const fetchWarehouses = async () => {
      const response = await GetwareHouses();

      if (response.data) setWarehouses(response.data);
    };

    fetchWarehouses();
  }, []);

  const handleAddWarehouse = async () => {
    console.log("chala");
    
      const newId = warehouses.length
        ? Math.max(warehouses.map((w) => w.id)) + 1
        : 1;
      const newWarehouse = {
        id: newId,
        role_id: Merchant_userId,
        warehouse_name: newWarehouseName.trim(),
        ...newWarehouseDetails,
      };
      console.log(newWarehouse);

      const response = await storeWareHouse(newWarehouse);

      if (response.data.message === "Warehouses saved successfully!") {
        setWarehouses((prev) => [...prev, newWarehouse]);
        resetForm();
        setShowModal(false);
        toast.success(response.data.message);
      }
  };

  const handleEditWarehouse = (id) => {
    const warehouseToEdit = warehouses.find((warehouse) => warehouse.id === id);
    setNewWarehouseName(warehouseToEdit.warehouse_name);
    setNewWarehouseDetails({
      id: warehouseToEdit.id,
      warehouse_name: warehouseToEdit.warehouse_name,
      address: warehouseToEdit.address,
      mobile_number: warehouseToEdit.mobile_number,
      email: warehouseToEdit.email,
      pin_code: warehouseToEdit.pin_code,
      role_id: warehouseToEdit.role_id,
      latitude: warehouseToEdit.latitude,
      longitude: warehouseToEdit.longitude,
    });
    setCurrentWarehouseId(id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateWarehouse = async () => {
    console.log(newWarehouseName);

    if (newWarehouseName.trim()) {
      const response = await UpdatewareHouses(newWarehouseDetails);

      if (response) {
        setWarehouses((prev) =>
          prev.map((warehouse) =>
            warehouse.id === currentWarehouseId
              ? {
                  ...warehouse,
                  // warehouse_name : newWarehouseName.trim(),
                  ...newWarehouseDetails,
                }
              : warehouse
          )
        );
        resetForm();
        setShowModal(false);
        setIsEditing(false);
        setCurrentWarehouseId(null);
        toast.success(response.data.message);
      }
    }
  };

  const handleDeleteWarehouse = async (id) => {
    if (id) {
      const response = await delterwarehouse(id);

      if (response.data.message === "warehouse  deleted successfully!") {
        setWarehouses((prev) =>
          prev.filter((warehouse) => warehouse.id !== id)
        );
        toast.success(response.data.message);
      }
    }
  };

  const resetForm = () => {
    setNewWarehouseName("");
    setNewWarehouseDetails({
      address: "",
      mobile: "",
      email: "",
      pin_code: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setNewWarehouseName(value);
    } else {
      setNewWarehouseDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleAddressExpansion = (id) => {
    setExpandedAddresses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <div className="flex justify-between">
        <h1 className="text-xl font-inter font-bold mb-6 border-b-4  pb-2 text-gray-700">Warehouse Management</h1>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center mb-4"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Add Warehouse
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Warehouse" : "Add New Warehouse"}
            </h2>

            <input
              type="text"
              name="warehouse_name"
              // value={newWarehouseName}
              value={newWarehouseDetails.warehouse_name}
              onChange={handleChange}
              placeholder="Warehouse Name"
              className="p-2 border border-gray-300 rounded-md mb-2 w-full"
            />
            <input
              type="text"
              name="address"
              value={newWarehouseDetails.address}
              onChange={handleChange}
              placeholder="Address"
              className="p-2 border border-gray-300 rounded-md mb-2 w-full"
            />
            <input
              type="text"
              name="mobile_number"
              value={newWarehouseDetails.mobile_number}
              onChange={handleChange}
              placeholder="Mobile No."
              className="p-2 border border-gray-300 rounded-md mb-2 w-full"
            />
            <input
              type="text"
              name="email"
              value={newWarehouseDetails.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-2 border border-gray-300 rounded-md mb-2 w-full"
            />
            <input
              type="text"
              name="pin_code"
              value={newWarehouseDetails.pin_code}
              onChange={handleChange}
              placeholder="Pin Code"
              className="p-2 border border-gray-300 rounded-md mb-4 w-full"
            />

            <input
              type="text"
              name="latitude"
              value={newWarehouseDetails.latitude}
              onChange={handleChange}
              placeholder="latitude"
              className="p-2 border border-gray-300 rounded-md mb-4 w-full"
            />

            <input
              type="text"
              name="longitude"
              value={newWarehouseDetails.longitude}
              onChange={handleChange}
              placeholder="longitude"
              className="p-2 border border-gray-300 rounded-md mb-4 w-full"
            />

            <div className="flex justify-end">
              <button
                onClick={isEditing ? handleUpdateWarehouse : handleAddWarehouse}
                className="bg-green-600 text-white px-4 py-2 rounded-md mr-2"
              >
                {isEditing ? "Update" : "Add"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-left">
            <th className="py-3 px-4">S.No</th>
            <th className="py-3 px-4">Warehouse Name</th>
            <th className="py-3 px-4">Address</th>
            <th className="py-3 px-4">Mobile No.</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Pin Code</th>
            <th className="py-3 px-4">Location</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.length > 0 ? (
            warehouses.map((warehouse, index) => (
              <tr key={warehouse.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{warehouse.warehouse_name}</td>
                <td className="py-3 px-4">
                  <div>
                    {expandedAddresses[warehouse.id] ? (
                      <div>
                        {warehouse.address.split(",").map((word, idx) => (
                          <div key={idx}>{word}</div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {warehouse.address
                          .split(",")
                          .slice(0, 3)
                          .map((word, idx) => (
                            <div key={idx}>{word}</div>
                          ))}
                        <button
                          onClick={() => toggleAddressExpansion(warehouse.id)}
                          className="text-blue-600 hover:text-blue-800 ml-2"
                        >
                          ...
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">{warehouse.mobile_number}</td>
                <td className="py-3 px-4">{warehouse.email}</td>
                <td className="py-3 px-4">{warehouse.pin_code}</td>
                <td className="py-3 px-4">
                  {warehouse.latitude + "/" + warehouse.longitude}
                </td>

                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEditWarehouse(warehouse.id)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  <button
                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-3 text-center">
                No warehouses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseManagement;
