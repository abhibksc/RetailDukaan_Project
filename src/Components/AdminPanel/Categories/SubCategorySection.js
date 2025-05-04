import React, { useEffect, useState } from "react";
import { storeSubCategory } from "../../CrudOperations/PostOperation";
import {
  ShowMainCategory,
  ShowSubCategory,
} from "../../CrudOperations/GetOperation";
import ShimmerUI from "../../ShimmerUi/shimmerUi";
import { Link, useLocation } from "react-router-dom";
import { Update_Sub_Category } from "../../CrudOperations/Update&Edit";
import { deleteSubCategory } from "../../CrudOperations/DeleteOperation";
import { Atom } from "react-loading-indicators";
import { toast } from "react-toastify";
import PaginationExample from "../Stocks/Purchase/PaginationExample";


const SubCategorySection = () => {
       const [currentPage, setCurrentPage] = useState(0); // Initial page is 0
        const itemsPerPage = 9; // Items per page
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);


  const [categories, setCategory] = useState([
    // Add more categories here
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    status: "Active",
    parentCategory: "",
    desktop_imageFile: null,
    desktop_imageUrl: "",

    mobile_imageFile: null,
    mobile_imageUrl: "",
  });







  const [errors, setErrors] = useState({ mobile_image: "" });
  const [desktopImage, setDesktopImage] = useState(selectedSubCategory ? selectedSubCategory.category_desktop_Image : null);
  const [mobileImage, setMobileImage] = useState(selectedSubCategory ? selectedSubCategory.category_mobile_Image_url : null);
  const [mobile_imageUrl, setMobile_imageUrl] = useState(null);

  const [name, setName] = useState(selectedSubCategory ? selectedSubCategory.name : "");
  const [categoryId, setCategoryId] = useState();
  const [status , setStatus] = useState("Active");
  const [EditingId , setEditingId] = useState("");


  // mobile_imageUrl: URL.createObjectURL(file),
  

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
        if (img.width === 188 && img.height === 250) {
          resolve();
        } else {
          reject("Image must be exactly 188x250 pixels");
        }
      };

      img.onerror = () => reject("Invalid image file");
    });
  };

  const handleImageChange = (type, file) => {
    if (!file) return;

    validateImage(file)
      .then(() => {
      if (type === "mobile_image") {
          
          setMobileImage(file)

          setMobile_imageUrl(URL.createObjectURL(file))
        
        
        };
        setErrors((prev) => ({ ...prev, [type]: "" }));
      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev, [type]: err }));
        if (type === "mobile_image") {
          
          setMobileImage(null)
          setMobile_imageUrl("")
        };
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(modalType);
    
   

    try {
      setLoading(true);
      if (modalType === "add") {
        const response = await StoreCategory(name, desktopImage, mobileImage, status);
        if (response.data.message === "Category created successfully") {
         console.log(response.data.message);
          
          onSubmit(response)
        }
        else{
          setErrors((prev) => ({ ...prev, desktop_image: response.data.message}));
        }
      }
      else if (modalType === "edit") {
        const Category_id = selectedCategory.id;
        console.log(selectedCategory);
        console.log(Category_id);

        

        const res = await Update_Main_Category(name, desktopImage, status , Category_id );
        if (res) {
           
           onSubmit(res)
         }
         else{
           setErrors((prev) => ({ ...prev, desktop_image: response.data.message}));
         }
        



      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, desktop_image: error}));
    } finally {
      setLoading(false);
    }
  };


















  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const categoryId = queryParams.get('sub_category_id ');
  // console.log(sub_category_id );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await ShowSubCategory();
        console.log(response);

        setSubCategories(response.data);

        const categories = await ShowMainCategory();
        console.log(categories);
        let arr = [];
        const names = categories.data.map((item) =>
          arr.push({ id: item.id, name: item.name })
        );

        console.log(arr);

        setCategory(arr);
        setLoading(false)

      } catch (err) {
        setError("Failed to load categories. Please try again.");
      }
    };
    fetchCategories();
  }, []);

  const handleActionClick = (ele) => {

    console.log(ele);

    setMobileImage(ele.mobile_image)
    setMobile_imageUrl(ele.mobile_image_url)
    setStatus(ele.status)
    setCategoryId(ele.category_id)
    setName(ele.name)
    setEditingId(ele.id)

    
    // setSelectedSubCategory(ele);
    setIsEdit(true);
    // setNewSubCategory(ele);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true)

    setSubCategories(
      subCategories.filter((subCategory) => subCategory.id !== id)
    );

    const response = await deleteSubCategory({ id: id });

    toast.error(response.data.message);

    setLoading(false)

  };

  const handleAddSubCategory = () => {
    setIsEdit(false);
    setNewSubCategory({
      name: "",
      status: "Active",
      parentCategory: "",
      imageFile: null,
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (isEdit && EditingId) {
      setLoading(true)


    
      const response = await Update_Sub_Category(      name,
        status,
        categoryId,
        mobileImage,
        EditingId,
  );
      console.log(response);
    
      // Check if the response is valid and contains the updated subcategory data
      if (response?.status === 200) {


        const response = await ShowSubCategory();
        console.log(response);

        setSubCategories(response.data);

        setLoading(false)
        setIsEdit(false);


        
        setIsModalOpen(false);
        setName("")
        setCategoryId(""),
        setStatus("Active"),
        setMobileImage(null)
        setMobile_imageUrl("")
        toast.success('Updated successfully!');



       
      }
    }
    else {

      setLoading(true);


      const response = await storeSubCategory(name,categoryId,status,mobileImage);
      console.log(response);

      if (response.data.message == "Subcategory created successfully") {



        const response = await ShowSubCategory();
        console.log(response);

        setSubCategories(response.data);

        const categories = await ShowMainCategory();
        console.log(categories);
        let arr = [];
        const names = categories.data.map((item) =>
          arr.push({ id: item.id, name: item.name })
        );


        setCategory(arr);



   
        











        setIsModalOpen(false);
        setName("")
        setCategoryId(""),
        setStatus("Active"),
        setMobileImage(null)
        setMobile_imageUrl("")
        toast.success('added successfully!');










    
    
        setLoading(false)
      }
      else{
        toast.error(response.data.message);
      }
      
    }




    
  };


  const closeModal = () => {

    setName("");
    setCategoryId(""),
    setStatus("Active"),
    setMobileImage(null)
    setMobile_imageUrl("")
    setErrors({ mobile_image: "" });
    setIsEdit(false);
    setSelectedSubCategory(null);
    setEditingId("");

    setIsModalOpen(false);
  };



    // Calculate the page count (total items divided by items per page)
    const pageCount = Math.ceil(subCategories.length / itemsPerPage);

    // Slice the items array to only show items for the current page
    const currentItems = subCategories.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // Handle page change
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };


  return (
    <div className="xl:container mx-auto shadow-lg rounded-md bg-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">SubCategory</h2>
        <button
          onClick={handleAddSubCategory}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add SubCategory
        </button>
      </div>



{loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className=" flex flex-col gap-4 p-6 bg-white rounded-md shadow-lg">
            <Atom color="#32cd32" size="medium" text="" textColor="" />
          </div>
        </div>
      )}

      {currentItems.length > 0 && (
        <div className="overflow-x-auto">
           <div className="text-end mb-2">total : {subCategories.length}</div>
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr>
                {/* <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                  S.No
                </th> */}
                <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
              Image
                </th>
                <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                  Name
                </th>
                <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
               Category Id
                </th>
                <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                  Status
                </th>
                <th className="py-3 px-5 bg-gray-100 text-left text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 &&
                currentItems.map((ele, index) => (
                  <tr key={ele.id} className="border-b last:border-0">
                    {/* <td className="py-3 px-5">{index + 1}</td> */}
                    <td className="py-3 px-5">
                      <img
                        src={ele.mobile_image_url}
                        alt={ele.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="py-3 px-5">{ele.name}</td>
                    <Link
                      to={`/admin/${localStorage.getItem("Merchanttoken")}/maincategory?category_id=${ele.category_id}`}
                    >
                      <td className="py-3 px-5 text-blue-600">
                        {ele.category_id}
                      </td>
                    </Link>
                    <td className="py-3 px-5">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          ele.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ele.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 flex space-x-2">
                      <button
                        onClick={() => handleActionClick(ele)}
                        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 7h16M4 11h16m-7 4h7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(ele.id)}
                        className="bg-red-200 p-2 rounded-lg hover:bg-red-300 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

<PaginationExample pageCount={pageCount} onPageChange={handlePageChange} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h2 className="text-xl font-bold mb-4">
              {isEdit ? "Edit SubCategory" : "Add SubCategory"}
            </h2>
            <form>


            <div>
            <label className="block text-sm font-medium text-gray-700">Name: *</label>
            <input
              type="text"
              className="mt-1 border p-2 w-full rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Main Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
            <label className="block text-sm font-medium text-gray-700">
              Status: *
            </label>
            <select
              className="mt-1 border p-2 w-full rounded"
              value={status || "Active"}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
             </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image *
                </label>
                <input
                  type="file"
                  onChange={(e) => handleImageChange("mobile_image", e.target.files[0])}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                      {errors.mobile_image && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile_image}</p>
            )}
                {mobile_imageUrl && (
                  <img
                    src={mobile_imageUrl}
                    alt="Preview"
                    className="mt-4 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>

           

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategorySection;
