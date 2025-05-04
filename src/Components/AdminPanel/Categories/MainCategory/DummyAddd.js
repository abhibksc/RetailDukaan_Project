import { useState, useEffect } from "react";
import { Atom } from "react-loading-indicators";
import { StoreCategory } from "../../../CrudOperations/PostOperation";
import { on } from "process";

const AddMainCategory = ({  category, onSubmit, onChange ,onClose }) => {
  const [errors, setErrors] = useState({ desktop: "", mobile: "" });
  const [loading, setLoading] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalType, setModalType] = useState("add");
    const [categoryData, setCategoryData] = useState({
      desktop_image: null,
      mobile_image: null,
      name: null,
      status: "Active",
    });


    const validateImage = (file, type) => {
      return new Promise((resolve, reject) => {
        if (!file) return reject("No file selected");
    
        const allowedExtensions = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
    
        if (!allowedExtensions.includes(file.type)) {
          return reject("Only jpeg, png, jpg, gif, webp images are allowed");
        }
    
        if (file.size > 100 * 1024) {
          return reject("Image must be less than or equal to 100KB");
        }
    
        const img = new Image();
        img.src = URL.createObjectURL(file);
    
        img.onload = () => {
          if (img.width === 128 && img.height === 128) {
            resolve();
          } else {
            reject("Image must be exactly 128x128 pixels");
          }
        };
    
        img.onerror = () => reject("Invalid image file");
      });
    };
    

  const handleImageChange = (type, file) => {
    if (!file) return;
    validateImage(file, type)
      .then(() => {
        onChange(type, file);
        setErrors((prev) => ({ ...prev, [type]: "" }));
      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev, [type]: err }));
        onChange(type, null);
      });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.name) {
      setErrors("The name field is required.");
      return;
    }


    console.log(modalType);
    

    try {
      setLoading(true);
      let response;

      if (modalType === "add") {
        response = await StoreCategory(categoryData);
        if (response) onSubmit(response);
      } else if (modalType === "edit" && selectedCategory) {
        const updatedCategory = { ...selectedCategory, ...categoryData };
        const res = await Update_Main_Category(updatedCategory);

        if (res) {
          const fetched = await ShowMainCategory();
          setFetchedCategory(fetched.data);
          setAlertMessage("Category updated successfully!");
        }
      }

      // Reset form
      setCategoryData({ name: "", image: "", status: "Active" });
      setErrors("");
      closeModal();
    } catch (error) {
      console.error(error);
      setErrors("Failed to save category. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };


  {if(loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className=" flex flex-col gap-4 p-6 bg-white rounded-md shadow-lg">
        <Atom color="#32cd32" size="medium" text="" textColor="" />
      </div>
    </div>
  )}




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Main Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Desktop Image: *
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 border p-2 w-full rounded"
              onChange={(e) => handleImageChange("desktop_image", e.target.files[0])}
            />
            {errors.desktop_image && (
              <p className="text-red-500 text-sm mt-1">{errors.desktop_image}</p>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Image:
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 border p-2 w-full rounded"
              onChange={(e) => handleImageChange("mobile_image", e.target.files[0])}
            />
            {errors.mobile_image && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile_image}</p>
            )}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name: *
            </label>
            <input
              type="text"
              className="mt-1 border p-2 w-full rounded"
              value={category.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status: *
            </label>
            <select
              className="mt-1 border p-2 w-full rounded"
              value={category.status || "Active"}
              onChange={(e) => onChange("status", e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMainCategory;
