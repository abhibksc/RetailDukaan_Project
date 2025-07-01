import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { storeWareHouse } from "../CrudOperations/PostOperation";
import { useSelector } from "react-redux";
import { GetwareHouses } from "../CrudOperations/GetOperation";
import { UpdatewareHouses } from "../CrudOperations/Update&Edit";
import { delterwarehouse } from "../CrudOperations/DeleteOperation";
import { toast } from "react-toastify";

const WarehouseManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [warehouses, setWarehouses] = useState([]);
  const [newWarehouseDetails, setNewWarehouseDetails] = useState({
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
  const [errors, setErrors] = useState({});

  const Merchant_userId = useSelector((state) => state.auth.Merchant_userId);
  const filteredWarehouses = warehouses.filter((warehouse) =>
  warehouse.warehouse_unique_id?.toLowerCase().includes(searchQuery.toLowerCase())
);


  useEffect(() => {
    const fetchWarehouses = async () => {
      const response = await GetwareHouses();
      if (response.data) setWarehouses(response.data);
    };
    fetchWarehouses();
  }, []);

  const validateForm = () => {
    const { mobile_number, email, pin_code, warehouse_name, address } = newWarehouseDetails;
    const newErrors = {};

    if (!warehouse_name.trim()) newErrors.warehouse_name = "Warehouse name is required.";
    if (!address.trim()) newErrors.address = "Address is required.";

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(mobile_number)) newErrors.mobile_number = "Invalid phone number.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address.";

    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(pin_code)) newErrors.pin_code = "Pincode must be 6 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddWarehouse = async () => {
    if (!validateForm()) return;

    const response = await storeWareHouse(newWarehouseDetails);
    if (response.data.message === "Warehouses saved successfully!") {
      setWarehouses((prev) => [...prev, response.data.newWarehouse || newWarehouseDetails]);
      resetForm();
      setShowModal(false);
      toast.success(response.data.message);
    }
    else{
      toast.error(response?.data?.message)
      toast.error(response?.data?.error)

    }
  };

  const handleEditWarehouse = (id) => {
    const warehouseToEdit = warehouses.find((warehouse) => warehouse.id === id);
    setNewWarehouseDetails({ ...warehouseToEdit });
    setCurrentWarehouseId(id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateWarehouse = async () => {
    if (!validateForm()) return;

    const response = await UpdatewareHouses(newWarehouseDetails);
    if (response?.data?.message) {
      setWarehouses((prev) =>
        prev.map((w) => (w.id === currentWarehouseId ? { ...w, ...newWarehouseDetails } : w))
      );
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setCurrentWarehouseId(null);
      toast.success(response.data.message);
    }
  };

  const handleDeleteWarehouse = async (id) => {
    const response = await delterwarehouse(id);
    if (response?.data?.message === "warehouse  deleted successfully!") {
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
      toast.success(response.data.message);
    }
  };

  const resetForm = () => {
    setNewWarehouseDetails({
      warehouse_name: "",
      address: "",
      mobile_number: "",
      email: "",
      pin_code: "",
      latitude: "",
      longitude: "",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWarehouseDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Warehouse Management</h1>
        

        <div className="flex">
          <div className="mb-4">
  <input
    type="text"
    placeholder="Search by Warehouse ID (e.g. WH0106202412)"
    className="border p-2 mx-20 w-full md:w-1/3 rounded"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} /> Add Warehouse
        </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg relative">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Warehouse" : "Add Warehouse"}
            </h2>

            {[
              { label: "Warehouse Name", name: "warehouse_name" },
              { label: "Address", name: "address" },
              { label: "Phone", name: "mobile_number" },
              { label: "Email", name: "email" },
              { label: "Pincode", name: "pin_code" },
              { label: "Latitude", name: "latitude" },
              { label: "Longitude", name: "longitude" },
            ].map((field) => (
              <div key={field.name} className="mb-3">
                <label className="block text-gray-700">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={newWarehouseDetails[field.name]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleUpdateWarehouse : handleAddWarehouse}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border mt-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-2 px-4">ID</th>
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Address</th>
              <th className="text-left py-2 px-4">Phone</th>
              <th className="text-left py-2 px-4">Email</th>
              <th className="text-left py-2 px-4">Pincode</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.map((warehouse) => (
              <tr key={warehouse.id} className="border-t">
                <td className="py-2 px-4">{warehouse.warehouse_unique_id}</td>
                <td className="py-2 px-4">{warehouse.warehouse_name}</td>
                <td className="py-2 px-4">{warehouse.address}</td>
                <td className="py-2 px-4">{warehouse.mobile_number}</td>
                <td className="py-2 px-4">{warehouse.email}</td>
                <td className="py-2 px-4">{warehouse.pin_code}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => handleEditWarehouse(warehouse.id)}
                    className="text-blue-600"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                    className="text-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseManagement;
