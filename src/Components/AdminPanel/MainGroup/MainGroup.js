import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import { ShowGroupCategories } from "../../CrudOperations/GetOperation";
import { deleteGroup } from "../../CrudOperations/DeleteOperation";
import { Update_Main_Group_Swapping } from "../../CrudOperations/Update&Edit";
import PaginationExample from "../../PaginationExample";
import AddMainGroupModal from "./AddMainGroupModal";
import PincodeModal from "./PincodeModal";

const Alert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
    {message}
    <button onClick={onClose} className="ml-4 text-white font-bold">
      &times;
    </button>
  </div>
);

const MainGroup = () => {
  const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
  const itemsPerPage = 9; // Items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({
    desktop_image: "",
    mobile_image: "",
    name: "",
    status: "Active",
  });
  const [fetchedCategory, setFetchedCategory] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [selectedGroupPincode, setSelectedGroupWarehouses] = useState([]);
  const [isPincodeModalOpen, setIsWarehouseModalOpen] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category_id");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await ShowGroupCategories();

        if (response?.data) {
          const sortedData = [...response.data].sort(
            (a, b) => a.sort_order - b.sort_order
          );
          setFetchedCategory(sortedData);
        }
      } catch (err) {
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openModal = (type, category = null) => {

    console.log(category);
    
    setModalType(type);
    setSelectedCategory(category);
    setCategoryData(category || {    image: "", name: "", status: "Active"  , warehouses : [] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);

    const response = await ShowGroupCategories();
    setFetchedCategory(response.data);
    setAlertMessage("Group updated successfully!");
  };

  // Calculate the page count (total items divided by items per page)
  const pageCount = Math.ceil(fetchedCategory.length / itemsPerPage);
  // Slice the items array to only show items for the current page
  const currentItems = fetchedCategory.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDelteMainCategory = async (id) => {
    setLoading(true);
    console.log(id);

    const categoryId = id;
    console.log(categoryId);

    const DeleteResponse = await deleteGroup({ id: categoryId });
    console.log(DeleteResponse);

    if (DeleteResponse.data.message == "Group deleted successfully") {
      const response = await ShowGroupCategories();
      console.log(response);

      setFetchedCategory(response.data);
    }

    setLoading(false);
  };

  const moveRow = async (index, direction) => {
    console.log("Chala1");

    const newRows = [...fetchedCategory];
    console.log("Chala1", newRows, direction, index);

    // Determine the new index
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fetchedCategory.length) {
      console.log("Chala1", newIndex, fetchedCategory.length);
      return;
    }

    // Get the two rows to swap
    const currentRow = newRows[index];
    const newRow = newRows[newIndex];

    // Swap items in the array
    [newRows[index], newRows[newIndex]] = [newRows[newIndex], newRows[index]];
    console.log("Chala1");

    setFetchedCategory(newRows);

    try {
      console.log(currentRow.id);
      console.log(newRow.id);

      // Send the updated rows (with their IDs and sort_order) to the backend
      const response = await Update_Main_Group_Swapping(
        currentRow.id,
        newRow.id
      );

      console.log("Response:", response);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const HandleServiceablePincode = (warehouses) => {
    console.log(warehouses);

    setSelectedGroupWarehouses(warehouses);
    setIsWarehouseModalOpen(true);
  };

  return (
    <div className="xl:container mx-auto shadow-lg rounded-md bg-white p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className=" flex flex-col gap-4 p-6 bg-white rounded-md shadow-lg">
            <Atom color="#32cd32" size="medium" text="" textColor="" />
          </div>
        </div>
      )}

      <div className="flex justify-between p-3">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-800">
          Manage Group
        </h2>
        <button
          className="bg-green-500 text-white py-1 px-3 rounded mb-6 hover:bg-green-600"
          // onClick={() => openModal("add")}
          onClick={() => navigate(`/admin/${localStorage.getItem("Merchanttoken")}/mainGroup/add`)}



        >
          Add
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <div className="text-end mb-2">total : {fetchedCategory.length}</div>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">
                ID
              </th>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">
                Image
              </th>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">
                Name
              </th>

              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">
                Swap
              </th>
              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">
                Status
              </th>

              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">
                Serviceable Warehouse
              </th>

              <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentItems) && currentItems.length > 0 ? (
              currentItems.map((category, index) => (
                <tr
                  key={category.group_id}
                  className={`border-b last:border-0 ${
                    categoryId == category.group_id ? "bg-yellow-100" : ""
                  }`}
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">
                    <img
                      src={category.image}
                      alt={category.group_name}
                      className="w-10 h-10 rounded"
                    />
                  </td>

                  <td className="py-3 px-6">{category.group_name}</td>

                  <td className="py-3 px-6">
                    <button
                      className="mx-2 font-bold text-blue-500 text-2xl"
                      onClick={() => moveRow(index, "up")}
                    >
                      &uarr;
                    </button>
                    <button
                      className="text-blue-500 font-bold text-2xl"
                      onClick={() => moveRow(index, "down")}
                    >
                      &darr;
                    </button>
                  </td>

                  <td className="py-3 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        category.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {category.status == 1 ? "Active" : "InActive"}
                    </span>
                  </td>

                  <td
                    className="py-3 cursor-pointer text-blue-500 px-6"
                    onClick={() => HandleServiceablePincode(category.warehouses)}
                  >
                    click
                  </td>

                  <td className="py-3 px-6 flex space-x-2">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                      // onClick={() => openModal("edit", category)}
                       onClick={() => navigate(`/admin/${localStorage.getItem("Merchanttoken")}/mainGroup/update/${category.group_id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => handleDelteMainCategory(category.group_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No items available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PincodeModal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
        warehouses={selectedGroupPincode}
      />

      <PaginationExample
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <AddMainGroupModal
          category={categoryData}
          onSubmit={handleSubmit}
          modalType={modalType}
          onClose={() => setIsModalOpen(false)}
          selectedCategory={selectedCategory}
        />
      )}

      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
      )}
    </div>
  );
};

export default MainGroup;
