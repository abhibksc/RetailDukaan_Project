import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AddDeliveryDates from "./AddDeliveryDates";
import { getAllDeliveyDates } from "../../../CrudOperations/GetOperation";
import { DeleteDeliveryDate } from "../../../CrudOperations/DeleteOperation";
// import { AddPinCode } from "../CrudOperations/PostOperation";
// import { getAllPincode } from "../CrudOperations/GetOperation";
// import { Deletepincode } from "../CrudOperations/DeleteOperation";
// import AddPinCodeModal from "./AddPinCodeModal";
// import { UpdatePinCodeStatus } from "../CrudOperations/Update&Edit";

const DeliveryDateDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDeiveryDateList, setFilteredDeiveryDateList] = useState([]);
  const [deliveryDateList, setDeliveryDatesList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentPincodeId, setCurrentPincodeId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchPincodes = async () => {
      const response = await getAllDeliveyDates();
      console.log(response);

      if (
        response.data.messsage === "All Delivery Dates Retrive Successfully!!"
      ) {
        console.log(response.data.data);

        setDeliveryDatesList(response.data.data);
        setFilteredDeiveryDateList(response.data.data);
      }
    };
    fetchPincodes();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = deliveryDateList.filter((p) =>
      p.pincode.includes(query)
    );
    setFilteredDeiveryDateList(filteredList);
  };

  useEffect(() => {
    console.log(filteredDeiveryDateList);
  }, [filteredDeiveryDateList]);

  const handleDeletePincode = async (id) => {
    const previousPincodeList = [...deliveryDateList];
    const previousfilteredDeiveryDateList = [...filteredDeiveryDateList];

    const updatedList = deliveryDateList.filter((p) => p.id !== id);
    setDeliveryDatesList(updatedList);
    setFilteredDeiveryDateList(updatedList);

    try {
      const response = await DeleteDeliveryDate(id);
      if (response.data.message == "Delivery Dates Deleted Successfully!!") {
        toast.success("Delivery Dates Deleted Successfully!!");
      } else {
        setDeliveryDatesList(previousPincodeList);
        setFilteredDeiveryDateList(previousfilteredDeiveryDateList);
        toast.error("Failed to delete pincode. Please try again.");
      }
    } catch (error) {
      setDeliveryDatesList(previousPincodeList);
      setFilteredDeiveryDateList(previousfilteredDeiveryDateList);
      toast.error("Error deleting pincode.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async () => {
    const response = await getAllDeliveyDates();
    if (
      response.data.messsage === "All Delivery Dates Retrive Successfully!!"
    ) {
      setDeliveryDatesList(response.data.data);
      setFilteredDeiveryDateList(response.data.data);
    }
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg shadow-gray-500">
      <h1 className="text-lg font-inter font-bold mb-6 border-b-4 border-blue-500 pb-2 text-gray-700">
        Manage Delivery Dates
      </h1> 

      <div className="mb-6 w-full flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Pincode..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="border border-gray-300 p-3 rounded-md  transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <button
          onClick={closeModal}
          className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition duration-200 transform hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-400 hover:shadow-lg"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add
        </button>
      </div>

      <table className="min-w-full bg-white table-auto border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              Pincode
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              No. of Days
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              Time
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredDeiveryDateList.length > 0 ? (
            filteredDeiveryDateList.map((p) => (
              <tr key={p.deliveryDate_id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-center">{p.pincode}</td>
                <td className="py-3 px-4 text-center">{p.noOfDays}</td>
                <td className="py-3 px-4 text-center">{p.time}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDeletePincode(p.deliveryDate_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-3 text-center text-gray-600">
                No Deliver Dates found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Pincode Modal */}
      {isModalOpen && (
        <AddDeliveryDates closeModal={closeModal} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default DeliveryDateDashboard;
