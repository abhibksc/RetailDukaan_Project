import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { fetchWarehousesPincode } from "../../CrudOperations/GetOperation";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const WarehouseList = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPincodes, setSelectedPincodes] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
   const fetchWarehouses = async () => {
        try {
          const res = await fetchWarehousesPincode();
          console.log(res);
          
          if (res?.data?.length > 0) {
             setWarehouseData(res.data);
          }
        } catch (err) {
          console.log("Error fetching warehouses", err);
        }
      };
      fetchWarehouses();
  }, []);


  const openModal = (pincodes, warehouseName) => {
    setSelectedPincodes(pincodes);
    setSelectedWarehouse(warehouseName);
    setModalIsOpen(true);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded shadow">
<div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Warehouse Pincode List</h2>
              <button
          className="bg-green-500 text-white py-1 px-3 rounded mb-6 hover:bg-green-600"
          // onClick={() => openModal("add")}
          onClick={() => navigate(`/admin/${localStorage.getItem("Merchanttoken")}/WarehousePincodeForm`)}



        >
          Add
        </button>
</div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Warehouse Name</th>
            <th className="border px-4 py-2">Warehouse ID</th>
            <th className="border px-4 py-2">All Area Pins</th>
            <th className="border px-4 py-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {warehouseData.map((wh) => (
            <tr key={wh.warehouse_id}>
              <td className="border px-4 py-2">{wh.warehouse_name}</td>
              <td className="border px-4 py-2">{wh.warehouse_unique_id}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => openModal(wh.AllAreaPine, wh.warehouse_name)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Pincodes
                </button>
              </td>
                <td className="border px-4 py-2 text-blue-500 cursor-pointer" 
          onClick={() => navigate(`/admin/${localStorage.getItem("Merchanttoken")}/WarehousePincodeForm/Edit/${wh.warehouse_id}`)}
                
                >Edit</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
  onRequestClose={() => setModalIsOpen(false)}
  contentLabel="Pincode Modal"
  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow max-w-lg w-full outline-none"
  overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-50"
      >
        <h2 className="text-lg font-semibold mb-4">
          Pincodes for: {selectedWarehouse}
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          {selectedPincodes.map((pin, index) => (
            <li key={index}>{pin}</li>
          ))}
        </ul>
        <button
          onClick={() => setModalIsOpen(false)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default WarehouseList;
