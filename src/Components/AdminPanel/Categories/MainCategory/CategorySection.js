import React, { useEffect, useState } from "react";
import { StoreCategory } from "../../../CrudOperations/PostOperation";
import { ShowMainCategory } from "../../../CrudOperations/GetOperation";
import { deleteMainCategory } from "../../../CrudOperations/DeleteOperation";
import { Update_Main_Category, Update_Main_Category_Swapping } from "../../../CrudOperations/Update&Edit";
import ShimmerUI from "../../../ShimmerUi/shimmerUi";
import { useLocation } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import PaginationExample from "../../Stocks/Purchase/PaginationExample";
import AddMainCategory from "./AddMainCategory";

const Alert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
    {message}
    <button onClick={onClose} className="ml-4 text-white font-bold">
      &times;
    </button>
  </div>
);






const CategorySection = () => {
  const [rows, setRows] = useState([]);
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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category_id");
  console.log(categoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await ShowMainCategory();
        console.log(response);

        if (response?.data) {
          const sortedData = [...response.data].sort((a, b) => a.sort_order - b.sort_order);
          console.log(sortedData);
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
    setModalType(type);
    setSelectedCategory(category);
    setCategoryData(category || { image: "", name: "", status: "Active" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleInputChange = (field, value) => {
    setCategoryData({ ...categoryData, [field]: value });
  };

  const handleSubmit = async () => {

    setIsModalOpen(false);
    
    const response = await ShowMainCategory();
          setFetchedCategory(response.data);
          setAlertMessage("Category updated successfully!");

  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteMainCategory({ id: selectedCategory.id });
      setFetchedCategory((prevCategories) =>
        prevCategories.filter((category) => category.id !== selectedCategory.id)
      );
      setAlertMessage("Category deleted successfully!");
    } catch (err) {
      setError("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(""), 3000);
      closeModal();
    }
  };


  
    // Calculate the page count (total items divided by items per page)
    const pageCount = Math.ceil(fetchedCategory.length / itemsPerPage)
    // Slice the items array to only show items for the current page
    const currentItems = fetchedCategory.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // Handle page change
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const handleDelteMainCategory = async(id) => {

      setLoading(true);
      console.log(id);
      
      const categoryId = id
      console.log(categoryId);

      const DeleteResponse = await deleteMainCategory({ id: categoryId });
      console.log(DeleteResponse);

      if(DeleteResponse.data.message == "Category deleted successfully"){


        const response = await ShowMainCategory();
        console.log(response);

        setFetchedCategory(response.data);

      }
      
      


      setLoading(false);





    }

    const moveRow = async (index, direction) => {
      console.log("Chala1");
  
      const newRows = [...fetchedCategory];
      console.log("Chala1", newRows, direction, index);
  
      // Determine the new index
      const newIndex = direction === 'up' ? index - 1 : index + 1;
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
          // Send the updated rows (with their IDs and sort_order) to the backend
          const response = await Update_Main_Category_Swapping(currentRow.id, newRow.id);
  
          console.log("Response:", response);
      } catch (error) {
          console.error("Error updating order:", error);
      }
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

      <h2 className="text-xl font-bold mb-6 text-gray-800">Categories</h2>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mb-6 hover:bg-green-600"
        onClick={() => openModal("add")}
      >
        Add New Category
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
      <div className="text-end mb-2">total : {fetchedCategory.length}</div>
        <table className="min-w-full">
          <thead>
            <tr>
              {/* <th className="py-3 px-6 bg-blue-500 text-left text-gray-800 font-semibold">
                ID
              </th> */}
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {console.log(currentItems)
            }
            {currentItems.map((category,index) => (
              <tr
                key={category.id}
                className={`border-b last:border-0 ${
                  categoryId == category.id ? "bg-yellow-100" : ""
                }`}
              >
                {/* <td className="py-3 px-6">{index + 1}</td> */}
                <td className="py-3 px-6">
                  <img
                    src={category.category_desktop_Image_url}
                    alt={category.name}
                    className="w-10 h-10 rounded"
                  />
                </td>


                <td className="py-3 px-6">{category.name}</td>

                <td className="py-3 px-6">
              <button className="mx-2 font-bold text-blue-500 text-2xl" onClick={() => moveRow(index, 'up')}>&uarr;</button>
              <button className="text-blue-500 font-bold text-2xl" onClick={() => moveRow(index, 'down')}>&darr;</button>
            </td>

                <td className="py-3 px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      category.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {category.status}
                  </span>
                </td>
                <td className="py-3 px-6 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    onClick={() => openModal("edit", category)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    onClick={() => handleDelteMainCategory(category.id)}
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
    
            <AddMainCategory
              category={categoryData}
              onSubmit={handleSubmit}
              modalType = {modalType}
              onClose={()=> setIsModalOpen(false)}
              selectedCategory = {selectedCategory}
            />
       
     
      )}

      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
      )}

      
    </div>
  );
};

export default CategorySection;
