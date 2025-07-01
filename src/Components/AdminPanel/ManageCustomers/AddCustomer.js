import {  useState } from "react";
import { Atom } from "react-loading-indicators";
import { StoreMainGroup } from "../../CrudOperations/PostOperation";
import { Update_Main_Group } from "../../CrudOperations/Update&Edit";


const AddCustomer = ({ category, onSubmit, modalType, onClose , selectedCategory }) => {
  const [errors, setErrors] = useState({ desktop_image: "", mobile_image: "" });
  const [loading, setLoading] = useState(false);
  const [desktopImage, setDesktopImage] = useState(selectedCategory ? selectedCategory.category_desktop_Image : null);
  const [mobileImage, setMobileImage] = useState(selectedCategory ? selectedCategory.category_mobile_Image_url : null);
  const [name, setName] = useState(selectedCategory ? selectedCategory.name : "");
  const [status , setStatus] = useState(selectedCategory ? selectedCategory.status : 1);
  console.log(selectedCategory);

  

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

    validateImage(file)
      .then(() => {
        if (type === "desktop_image") setDesktopImage(file);
        else if (type === "mobile_image") setMobileImage(file);
        setErrors((prev) => ({ ...prev, [type]: "" }));
      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev, [type]: err }));
        if (type === "desktop_image") setDesktopImage(null);
        if (type === "mobile_image") setMobileImage(null);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(modalType);
    
   

    try {
      setLoading(true);
      if (modalType === "add") {
        const response = await StoreMainGroup(name, desktopImage, mobileImage, status);
        if (response.data.message === "Group created successfully") {
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

        

        const res = await Update_Main_Group(name, desktopImage, status , Category_id );
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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
        <div className="flex flex-col gap-4 p-6 bg-white rounded-md shadow-lg">
          <Atom color="#32cd32" size="medium" text="" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Desktop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
               Image: *
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status: *
            </label>
            <select
              className="mt-1 border p-2 w-full rounded"
              value={status || 1}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          {/* Actions */}
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

export default AddCustomer;
