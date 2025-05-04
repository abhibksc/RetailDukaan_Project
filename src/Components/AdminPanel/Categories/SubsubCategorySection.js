import React, { useEffect, useState } from "react";
import { storeSubSubCategory } from "../../CrudOperations/PostOperation";
import {
  Show_Sub_SubCategory,
  ShowMainCategory,
  ShowSubCategory,
} from "../../CrudOperations/GetOperation";
import { DeleteSubSubCategory } from "../../CrudOperations/DeleteOperation";
import { Update_Sub_SubCategory } from "../../CrudOperations/Update&Edit";
import { Link, useNavigate } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import { toast } from "react-toastify";
import { View } from "lucide-react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PaginationExample from "../Stocks/Purchase/PaginationExample";

const SubsubCategorySection = () => {
  const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
  const itemsPerPage = 9; // Items per page
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subsubCategories, setSubsubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentParentCategories, setParentParentCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedSubsubCategory, setSelectedSubsubCategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [CategoryModalData, setCategoryModalData] = useState(false);
  const [errors, setErrors] = useState({ mobile_image: "" });

  const [newSubsubCategory, setNewSubsubCategory] = useState({
    name: "",
    status: "Active",
    parentCategory: "",
    parentParentCategory: "",
    image: null,
    id: "",
  });



  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return reject("Only jpeg, png, jpg, gif, webp images are allowed");
      }

      if (file.size > 100 * 1024) {
        return reject("Image must be ≤ 100KB");
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width === 83 && img.height === 90) {
          resolve();
        } else {
          reject("Image must be exactly 83x90 pixels");
        }
      };

      img.onerror = () => reject("Invalid image file");
    });
  };

  const handleImageChange = (file) => {
    if (!file) return;

    validateImage(file)
      .then(() => {

          setNewSubsubCategory((prev) => ({
      ...prev,
      image: file,
    }));
    setErrors((prev) => ({ ...prev,  "mobile_image": "" }));





      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev,  "mobile_image": err }));
          
        setNewSubsubCategory((prev) => ({
          ...prev,
          image: "",
        }));


      });
  };


















  const navigate = useNavigate();


  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const [subSubCategoryRes, mainCategoryRes, subCategoryRes] =
          await Promise.all([
            Show_Sub_SubCategory(),
            ShowMainCategory(),
            ShowSubCategory(),
          ]);


        setSubsubCategories(subSubCategoryRes.data);
        setParentParentCategories(mainCategoryRes.data);
        setCategories(subCategoryRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);


  const handleParentParentCategoryChange = (e) => {

    
    const selectedCategory = e.target.value;



    const selectedParentCategory = parentParentCategories.find(
      (category) => category.id == selectedCategory
    );

    

    if (selectedParentCategory) {
      const { id } = selectedParentCategory;
      setNewSubsubCategory((prev) => ({
        ...prev,
        parentParentCategory: selectedCategory,
        id,
      }));
      setFilteredCategories(
        categories.filter((category) => category.category_id === id)
      );
    } else {
      setError("Selected Grand Parent Category not found.");
    }



  };

  const handleAddSubsubCategory = () => {
    setIsEditMode(false);

    
    setNewSubsubCategory({
      name: "",
      status: "Active",
      parentCategory: "",
      parentParentCategory: "",
      image: null,
    });

    
    setIsAddEditModalOpen(true);
  };

  const handleAddEditSubmit = async (e) => {
    e.preventDefault();

    try {
      // const imageURL = newSubsubCategory.image
      //   ? URL.createObjectURL(newSubsubCategory.image)
      //   : null;

      if (isEditMode) {
        setLoading(true);

        // setSubsubCategories((prev) =>
        //   prev.map((cat) =>
        //     cat.id === selectedSubsubCategory.id
        //       ? { ...cat, ...newSubsubCategory, image: imageURL }
        //       : cat
        //   )
        // );

        // console.log(newSubsubCategory);

        const response = await Update_Sub_SubCategory(newSubsubCategory);
        console.log(response);

        if (response && response.data.message === "Updated Successfully" ) {


          const [subSubCategoryRes, mainCategoryRes, subCategoryRes] =
          await Promise.all([
            Show_Sub_SubCategory(),
            ShowMainCategory(),
            ShowSubCategory(),
          ]);

        console.log(subSubCategoryRes);
        console.log(mainCategoryRes);
        console.log(subCategoryRes);

        setSubsubCategories(subSubCategoryRes.data);
        setParentParentCategories(mainCategoryRes.data);
        setCategories(subCategoryRes.data);
        setLoading(false);


        setIsAddEditModalOpen(false)
        setIsEditMode(false);
        } else {
          toast.error();
        }
      } else {
        setLoading(true);

        console.log(newSubsubCategory);
        

        const res = await storeSubSubCategory(newSubsubCategory);
        console.log(res);

        if (res?.data?.message == "SubSubcategory created successfully") {
          
          const getdata = await Show_Sub_SubCategory();

          if (getdata && getdata?.data?.length > 0) {
            setSubsubCategories(getdata?.data);
          }


          toast.success(res.data.message)


        } 
        else{
          

          toast.error(res?.data?.message);
        }

        setLoading(false);
      }


      // setIsAddEditModalOpen(false);
      setNewSubsubCategory({
        name: "",
        status: "Active",
        parentCategory: "",
        parentParentCategory: "",
        image: null,
        id: "",
      });
      setSelectedSubsubCategory(null);
      setIsAddEditModalOpen(false);
      setIsEditMode(false);

    } catch (err) {
      setError("Failed to save the sub-subcategory. Please try again.");
    }
  };

  const handleEditSubsubCategory = (subsubCategory) => {








    try {

      setNewSubsubCategory({
        name: subsubCategory.SubSubCategoryName,
        status: subsubCategory.Status,
        parentParentCategory: subsubCategory.CategoryId,
        parentCategory: subsubCategory.SubCategoryId,
        image: subsubCategory.image,
        id: subsubCategory.SubSubCategoryId,
      });

      setFilteredCategories(
            categories.filter(
              (category) => category.category_id === subsubCategory.CategoryId
            )
          );



          setIsEditMode(true);
          setIsAddEditModalOpen(true);


    } catch (err) {
      setError("Failed to load categories. Please try again.");
    }

























    // setParentParentCategories(mainCategoryRes.data);

    // setFilteredCategories(
    //   categories.filter((category) => category.category_id === subsubCategory.CategoryId)
    // );

    // setNewSubsubCategory({
    //   name: subsubCategory.SubSubCategoryName,
    //   status: "Active",
    //   parentCategory: subsubCategory.SubCategoryId,
    //   parentParentCategory: subsubCategory.CategoryId,
    //   image: null,
    //   id: subsubCategory.SubSubCategoryId,
    // });

    // setSelectedSubsubCategory(subsubCategory);

    // const selectedGrandParent = parentParentCategories.find(
    //   (ele) => ele.id === subsubCategory.grant_parent_Category_id
    // );
    // const selectedParent = categories.find(
    //   (ele) => ele.id === subsubCategory.parent_Category_id
    // );

    // if (selectedGrandParent) {
    //   setFilteredCategories(
    //     categories.filter(
    //       (category) => category.category_id === selectedGrandParent.id
    //     )
    //   );

    //   setNewSubsubCategory({
    //     name: subsubCategory.name,
    //     status: subsubCategory.status,
    //     parentParentCategory: selectedGrandParent.name,
    //     parentCategory: selectedParent ? selectedParent.name : "",
    //     image: subsubCategory.image,
    //     id: subsubCategory.id,
    //   });
    // }

  };

  const handleDelete = async () => {
    setLoading(true);

    const response = await DeleteSubSubCategory({
      id: selectedSubsubCategory.SubSubCategoryId,
    });

    if (response.data.message == "sub_subcategories deleted successfully") {
      const [subSubCategoryRes, mainCategoryRes, subCategoryRes] =
        await Promise.all([
          Show_Sub_SubCategory(),
          ShowMainCategory(),
          ShowSubCategory(),
        ]);

      console.log(subSubCategoryRes);
      console.log(mainCategoryRes);
      console.log(subCategoryRes);

      setSubsubCategories(subSubCategoryRes.data);
      setParentParentCategories(mainCategoryRes.data);
      setCategories(subCategoryRes.data);

      toast.success(response.data.message);
      setIsDeleteModalOpen(false);
      setSelectedSubsubCategory(null);
      setLoading(false);
    } else {
      toast.error(response.data.message);
      setIsDeleteModalOpen(false);
      setSelectedSubsubCategory(null);
      setLoading(false);
    }
  };

  const handleDeleteClick = (subsubCategory) => {
    setLoading(true);

    console.log(subsubCategory.id);

    setSelectedSubsubCategory(subsubCategory);
    setIsDeleteModalOpen(true);
    setLoading(false);
  };

  // const handleImageChange = (e) => {
  //   setNewSubsubCategory((prev) => ({
  //     ...prev,
  //     image: e.target.files[0],
  //   }));
  // };

  // Calculate the page count (total items divided by items per page)
  const pageCount = Math.ceil(subsubCategories.length / itemsPerPage);

  // Slice the items array to only show items for the current page
  const currentItems = subsubCategories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className=" flex flex-col gap-4 p-6 bg-white rounded-md shadow-lg">
              <Atom color="#32cd32" size="medium" text="" textColor="" />
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-900">SubsubCategory</h2>
        <button
          onClick={handleAddSubsubCategory}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Add SubsubCategory
        </button>
      </div>

      {error && (
        <div className="mb-8 text-red-600">
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="text-end mb-2">total : {subsubCategories.length}</div>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              {/* <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">
                S.No
              </th> */}
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">
                Image
              </th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">
                Name
              </th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">
                Status
              </th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">
                Category
              </th>
              <th className="py-3 px-6 text-left text-gray-700 font-semibold border-b">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((subsubCategory, index) => (
              <tr key={`${subsubCategory.name}-${index}`} className="border-b last:border-0">
                {/* <td className="py-4 px-6 text-gray-800">{index + 1}</td> */}
                <td className="py-4 px-6 text-gray-800">
                  {subsubCategory.image_url ? (
                    <img
                      src={subsubCategory.image_url}
                      alt={subsubCategory.SubSubCategory_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="py-4 px-6 text-gray-800">
                  {subsubCategory.SubSubCategoryName}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                      subsubCategory.Status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subsubCategory.Status}
                  </span>
                </td>

                <td className="py-4 px-6">
                  <button
                    onClick={() => {
                      setIsOpenCategoryModal(true);
                      setCategoryModalData({
                        CategoryName: subsubCategory.CategoryName,
                        SubCategoryName: subsubCategory.SubCategoryName,
                      });
                    }}
                    className="bg-red-500 text-white py-1 px-2 rounded-md"
                  >
                    <FontAwesomeIcon icon={faEdit} />{" "}
                    {/* Use the imported icon */}
                  </button>
                </td>

                <td className="py-4 px-6 flex space-x-2">
                  <button
                    onClick={() => handleEditSubsubCategory(subsubCategory)}
                    className="bg-yellow-400 text-white px-4 py-3 rounded-lg hover:bg-yellow-500 transition-colors shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(subsubCategory)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationExample
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />

      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-6">
              {isEditMode ? "Edit SubsubCategory" : "Add New SubsubCategory"}
            </h2>
            <form onSubmit={handleAddEditSubmit}>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Main Category
                </label>
                <select
                  value={newSubsubCategory.parentParentCategory}
                  onChange={handleParentParentCategoryChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="" disabled>
                    Select Main Category
                  </option>
                  {parentParentCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Sub Category
                </label>
                <select
                  value={newSubsubCategory.parentCategory}
                  onChange={(e) =>
                    setNewSubsubCategory((prev) => ({
                      ...prev,
                      parentCategory: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="" disabled>
                    Select Sub Category
                  </option>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  required={!isEditMode}
                  type="text"
                  value={newSubsubCategory.name}
                  onChange={(e) =>
                    setNewSubsubCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>


              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Status
                </label>
                <select
                                  required={!isEditMode}

                  value={newSubsubCategory.status}
                  onChange={(e) =>

                    setNewSubsubCategory((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))



                    
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>


              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Image
                </label>
                <input
                                    required={!isEditMode}

                  type="file"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              {errors.mobile_image && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile_image}</p>
            )}


              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>


            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-6">
              Are you sure you want to delete this SubsubCategory?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpenCategoryModal && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
          onClick={() => setIsOpenCategoryModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Category Details
            </h2>

            {/* Details */}
            <div className="space-y-4">
              <>
                <div className="flex justify-between">
                  <p className="text-gray-600">Category:</p>
                  <p className="font-medium text-gray-800">
                    {CategoryModalData.CategoryName}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">SubCategory:</p>
                  <p className="font-medium text-gray-800">
                    {CategoryModalData.SubCategoryName}
                  </p>
                </div>
              </>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={() => setIsOpenCategoryModal(false)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md w-full md:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubsubCategorySection;
