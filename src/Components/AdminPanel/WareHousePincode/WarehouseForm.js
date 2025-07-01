import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkMultiplePincodes,
  fetchWarehousesPincode,
  GetwareHouses,
} from "../../CrudOperations/GetOperation";
import { saveWarehousesPincode } from "../../CrudOperations/PostOperation";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

const WarehousePincodeForm = () => {
  const [warehouseList, setWarehouseList] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [addedPincodes, setAddedPincodes] = useState([]);
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const [pincodeWarnings, setPincodeWarnings] = useState([]);


  const { warehouse_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (warehouse_id) {
      const fetchWarehouses = async () => {
        try {
          const res = await fetchWarehousesPincode();
          if (res?.data?.length > 0) {
            const warehouse = res.data.find(
              (ele) => ele.warehouse_id == warehouse_id
            );

            if (warehouse) {
              setWarehouseId(warehouse.warehouse_id.toString());
              setAddedPincodes(warehouse.AllAreaPine || []);
            }
          }
        } catch (err) {
          console.log("Error fetching warehouse for edit", err);
        }
      };
      fetchWarehouses();
    }
  }, [warehouse_id]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await GetwareHouses();
        if (res.data.length > 0) {
          setWarehouseList(res.data);
        }
      } catch (err) {
        console.log("Error fetching warehouses", err);
      }
    };
    fetchWarehouses();
  }, []);

const handleCheckPincodes = async () => {
  if (!pincodeInput.trim()) return;

  setChecking(true);
  try {
    const res = await checkMultiplePincodes({
      pincodes: pincodeInput,
    });

    if (res?.data?.status === "warning") {
      if (Array.isArray(res.data.existing)) {
        const warningMsg = res.data.existing
          .map(
            (item) =>
              `Pincode ${item.pincode} already exists in ${item.warehouse_name}`
          )
          .join("\n");

        toast.warning(warningMsg, { autoClose: false });
        setPincodeWarnings(res.data.existing); // show inline
      } else {
        toast.warning(res.data.message);
        setPincodeWarnings([]);
      }
    } else if (res?.data?.status === "success") {
      toast.success(res.data.message);
      setPincodeWarnings([]);
    }
  } catch (err) {
    console.log("Check error", err);
    toast.error("Error checking pincodes");
    setPincodeWarnings([]);
  }
  setChecking(false);
};



  const handleAddPincodes = () => {
    if (!pincodeInput.trim()) return;

    const newPincodes = pincodeInput
      .split(",")
      .map((pin) => pin.trim())
      .filter((pin) => pin && !addedPincodes.includes(pin));

    setAddedPincodes((prev) => [...prev, ...newPincodes]);
    setPincodeInput("");
  };

  const handleRemovePincode = (pinToRemove) => {
    setAddedPincodes((prev) => prev.filter((pin) => pin !== pinToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!warehouseId || addedPincodes.length === 0) {
      alert("Please select a warehouse and add at least one pincode.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("warehouseId", warehouseId);
    formDataToSend.append("pincodes", JSON.stringify(addedPincodes));

    try {
      const response = await saveWarehousesPincode(formDataToSend);
      if (response?.data?.message === "Pincodes saved successfully") {
        toast.success(response?.data?.message);
        navigate(`/admin/${localStorage.getItem("Merchanttoken")}/warehouseList`);
      } else {
        toast.error(response?.data?.message || "Unknown response");
      }
    } catch (err) {
      console.log("Submission error:", err);
      toast.error(
        err?.response?.data?.message || err?.response?.data?.error || "Error"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-xl font-semibold border-b-2 py-3">
        {warehouse_id ? "Edit Warehouse Pincodes" : "Assign Pincodes to Warehouse"}
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm mb-1">Select Warehouse</label>
          <select
            className="w-full p-2 border rounded"
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            required
            disabled={!!warehouse_id}
          >
            <option value="">-- Choose --</option>
            {warehouseList.map((w) => (
              <option key={w.id} value={w.id}>
                {w.warehouse_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">Enter Pincodes (comma-separated)</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder="110001,110002"
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
            />
            <button
              type="button"
              onClick={handleCheckPincodes}
              className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 flex items-center gap-2"
            >
              {checking ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <FaSearch size={14} />
              )}
              Check
            </button>
            <button
              type="button"
              onClick={handleAddPincodes}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {addedPincodes.length > 0 && (
        <div>
          <h4 className="mt-4 font-medium mb-2">Added Pincodes:</h4>
          <div className="flex flex-wrap gap-2">
            {addedPincodes.map((pin, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full"
              >
                <span>{pin}</span>
                <button
                  onClick={() => handleRemovePincode(pin)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {pincodeWarnings.length > 0 && (
  <div className="mt-2 text-sm text-red-600 space-y-1">
    {pincodeWarnings.map((item, idx) => (
      <p key={idx}>
        🚫 <strong>{item.pincode}</strong> already exists in{" "}
        <strong>{item.warehouse_name}</strong>
      </p>
    ))}
  </div>
)}


      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit to Backend
        </button>
      </form>
    </div>
  );
};

export default WarehousePincodeForm;