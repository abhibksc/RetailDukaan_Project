import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  GetAllCreatedItems,
  Show_Users_MainCategory,
  Show_Users_Sub_SubCategory,
  Show_users_SubCategory,
} from "../../CrudOperations/GetOperation";
import { CreteItems } from "../../CrudOperations/PostOperation";
import { ChangeItemStatus } from "../../CrudOperations/Update&Edit";
import { deleteStoredItem } from "../../CrudOperations/DeleteOperation";
import PaginationExample from "../Stocks/Purchase/PaginationExample";

const AddItems = () => {


    const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
    const itemsPerPage = 9; // Items per page






  const location = useLocation();
  const [filteredLooseVarientList, setFilteredLooseVarientList] = useState([]);

  const [category_id, setCategoryId] = useState("");

  const [Status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //   const [category_id, setCategoryId] = useState("");
  const [subCategory_id, setSubCategoryId] = useState("");
  const [sub_subCategory_id, setSub_SubCategoryId] = useState("");
  const [ItemName, setItemName] = useState("");
  const [CategoryList, setCategoryList] = useState([]);
  const [SubCategoryList, setSubCategoryList] = useState([]);
  const [Sub_SubCategoryList, setSub_SubCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  // Fetch Categories, Subcategories, and Sub-Subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [items, Category, Sub_Category, Sub_subCategory] =
          await Promise.all([
            GetAllCreatedItems(),
            Show_Users_MainCategory(),
            Show_users_SubCategory(),
            Show_Users_Sub_SubCategory(),
          ]);
        console.log(items);
        if (items.data.message === "All Items retrieved successfully!")
          console.log(items.data.data);
          
          setProductList(items.data.data);
        if (Category?.data) setCategoryList(Category.data);
        if (Sub_Category?.data) setSubCategoryList(Sub_Category.data);
        if (Sub_subCategory?.data) setSub_SubCategoryList(Sub_subCategory.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);




  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !ItemName ||
      !category_id ||
      !subCategory_id ||
      !sub_subCategory_id ||
      !Status
    ) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const formDataa = {
        ItemName,
        category_id,
        subCategory_id,
        sub_subCategory_id,
        Status,
      };
      console.log(formDataa);
      const response = await CreteItems({ formDataa });
      if (response.data.message === "Item saved successfully!") {
        const getItems = await GetAllCreatedItems();
        if (getItems.data.message === "All Items retrieved successfully!") {
          console.log(getItems.data.data);
          setProductList(getItems.data.data);
          setItemName("");
          // setSub_SubCategoryId("");
        }
        toast.success("Item added successfully!");
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  // Filter Subcategories based on selected Category
  const filteredSubCategories = SubCategoryList.filter(
    (subCat) => subCat.category_id === Number(category_id)
  );

  // Filter Sub-Subcategories based on selected Subcategory
  const filteredSubSubCategories = Sub_SubCategoryList.filter(
    (subSubCat) => subSubCat.sub_category_id === Number(subCategory_id)
  );

  //   handleStatus

  const handleStatus = async (id, e) => {
    console.log(e.target.value);
    setLoading(true);
    const response = await ChangeItemStatus({ id, Status: e.target.value });
    if (response.data.message === "ItemStatus updated successfully!") {
      const getItems = await GetAllCreatedItems();
      if (getItems.data.message === "All Items retrieved successfully!") {
        console.log(getItems.data.data);
        setProductList(getItems.data.data);
        toast.success("Status Updated successfully!");
      }
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    console.log(id);

    setLoading(true)

    const response = await deleteStoredItem({ id });
    if (
      response.data.message ===
      "Stored Item and related entries deleted successfully!"
    ) {
      const getItems = await GetAllCreatedItems();
      if (getItems.data.message === "All Items retrieved successfully!") {
        console.log(getItems.data.data);
        setProductList(getItems.data.data);
        toast.success("Item Deleted successfully!");
      }
    }

    setLoading(false)
  };

  const filteredProductList = productList.filter((item) =>
    item.ItemName.toLowerCase().includes(searchQuery.toLowerCase())
);

// Recalculate pageCount based on filtered products
const pageCount = Math.ceil(filteredProductList.length / itemsPerPage);

// Get current items based on filtered list and page
const currentItems = filteredProductList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
);

// Handle page change
const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
};

  return (
    <div className="p-6 bg-white rounded shadow-md">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2 ">Create Item</h1>

      {/* Add Item Form */}
      <div className="grid grid-cols-4 gap-5 border-b-2 p-2  pb-5">
        <div className="mb-2">
          <label className="block text-gray-700">Item Name</label>
          <input
            value={ItemName}
            onChange={(e) => setItemName(e.target.value)}
            type="text"
            placeholder="Enter item name"
            className="border border-gray-300 p-1 w-full rounded-md"
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-2">
          <label className="block text-gray-700">Category</label>
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border border-gray-300 p-1 w-full rounded-md"
          >
            <option value="">Select Category</option>
            {CategoryList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* SubCategory Dropdown */}
        <div className="mb-2">
          <label className="block text-gray-700">Sub Category</label>
          <select
            value={subCategory_id}
            onChange={(e) => setSubCategoryId(e.target.value)}
            className="border border-gray-300 p-1 w-full rounded-md"
            disabled={!category_id}
          >
            <option value="">Select SubCategory</option>
            {filteredSubCategories.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-SubCategory Dropdown */}
        <div className="mb-2">
          <label className="block text-gray-700">Sub SubCategory</label>
          <select
            value={sub_subCategory_id}
            onChange={(e) => setSub_SubCategoryId(e.target.value)}
            className="border border-gray-300 p-1 w-full rounded-md"
            disabled={!subCategory_id}
          >
            <option value="">Select Sub SubCategory</option>
            {filteredSubSubCategories.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label htmlFor="status" className="block text-gray-700">
            Status
          </label>
          <select
            id="Status"
            value={Status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className=" bg-blue-600 text-white py-2 px-4 mt-6 rounded"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between mt-5 items-center">
        <input
          type="text"
          placeholder="Search Items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 border p-3 rounded-md"
        />
      </div>

      {/* Product Table */}
      <div className="mt-4">

        <h2 className="text-xl text-start font-semibold mb-4">Item List</h2>
        <div className="text-start mb-4 text-sm">
          {filteredProductList.length} Items found

        </div>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">S.no</th>
              <th className="py-2 px-4 border">Item Name</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Sub Category</th>
              <th className="py-2 px-4 border">Sub SubCategory</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Delete</th>
            </tr>
          </thead>
          <tbody>
  {currentItems.map((item, index) => (
    <tr key={item.id}>
      <td className="py-2 px-4 border text-center">
        {currentPage * itemsPerPage + index + 1}
      </td>
      <td className="py-2 px-4 border text-center">{item.ItemName}</td>
      <td className="py-2 px-4 border text-center">{item.Category_name}</td>
      <td className="py-2 px-4 border text-center">{item.subcategories_name}</td>
      <td className="py-2 px-4 border text-center">{item.sub_subcategories_name}</td>
      <td className="py-2 px-4 border text-center">
        <div className="mb-2">
          <select
            id="Status"
            value={item.Status}
            onChange={(e) => handleStatus(item.id, e)}
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </td>
      <td className="py-2 px-4 border text-center">
        <button
          onClick={() => deleteItem(item.id)}
          className="bg-red-500 text-white py-1 px-2 rounded-md"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      <PaginationExample pageCount={pageCount} onPageChange={handlePageChange} />


      
    </div>
  );
};

export default AddItems;
