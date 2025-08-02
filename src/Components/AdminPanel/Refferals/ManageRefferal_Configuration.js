import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import PaginationExample from "../../PaginationExample";
import { Update_Main_Group_Swapping } from "../../CrudOperations/Update&Edit";
import { deleteGroup, DeleteRefferal_Configuraion } from "../../CrudOperations/DeleteOperation";
import { getRefferal_Configuraion, ShowGroupCategories } from "../../CrudOperations/GetOperation";
import AddRefferal_Configuration from "./AddRefferal_Configuration";
import VisualMilstone from "./VisualMilstone";

const Alert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
    {message}
    <button onClick={onClose} className="ml-4 text-white font-bold">
      &times;
    </button>
  </div>
);

const ManageRefferal_Configuration = () => {
  const [fetchedData, setFetchedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [configData, setConfigData] = useState({
    desktop_image: "",
    mobile_image: "",
    name: "",
    status: "Active",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 9;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightId = queryParams.get("RefferalConfiguration_id");

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await getRefferal_Configuraion();
      if (response?.message === "All Refferal Configuration retrieved successfully!") {
        setFetchedData(response.data);
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, config = null) => {
    setModalType(type);
    setSelectedConfig(config);
    setConfigData(config || { desktop_image: "", mobile_image: "", name: "", status: "Active" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConfig(null);
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    await fetchConfigurations();
    setAlertMessage("Saved");
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await DeleteRefferal_Configuraion({ id });

      console.log(response);
      
      if (response?.data?.message == `Refferal Configuration with ID ${id} deleted successfully.`) {
        setIsModalOpen(false);
         await fetchConfigurations();
        setAlertMessage("Configuration deleted successfully!");
      }
    } catch (err) {
      setError("Failed to delete configuration.");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const pageCount = Math.ceil(fetchedData.length / itemsPerPage);
  const currentItems = fetchedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className=" ">

      <div className="shadow-lg rounded-md bg-white p-4">


            {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="p-6 bg-white rounded-md shadow-lg">
            <Atom color="#32cd32" size="medium" />
          </div>
        </div>
      )}

      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage("")} />}

      <div className="flex justify-between p-3">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Manage Referrals Milestone</h2>
        <button
          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
          onClick={() => openModal("add")}
        >
          Add
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <div className="text-end mb-2">Total: {fetchedData.length}</div>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">S.no</th>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">Name</th>

              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">Required Customer</th>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">Reward Amount</th>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">Status</th>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((config, idx) => (
              <tr
                key={config.id}
                className={`border-b last:border-0 ${highlightId == config.id ? "bg-yellow-100" : ""}`}
              >
                <td className="py-3 px-6">{currentPage * itemsPerPage + idx + 1}</td>
                <td className="py-3 px-6">{config.MileStoneName}</td>
                
                <td className="py-3 px-6">{config.referrals_required}</td>
                <td className="py-3 px-6">{config.reward_amount}</td>
                <td className="py-3 px-6">{config.status}</td>
                <td className="py-3 px-6 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    onClick={() => openModal("edit", config)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    onClick={() => handleDelete(config.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationExample pageCount={pageCount} onPageChange={handlePageChange} />

      {isModalOpen && (
        <AddRefferal_Configuration
          RefferalConfiguration={configData}
          onSubmit={handleSubmit}
          modalType={modalType}
          onClose={closeModal}
          selectedRefferalConfiguration={selectedConfig}
        />
      )}

      </div>
  

      <VisualMilstone isModalOpen={isModalOpen}/>
    </div>
  );
};

export default ManageRefferal_Configuration;
