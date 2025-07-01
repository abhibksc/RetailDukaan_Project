import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { StoreBrand } from "../../CrudOperations/PostOperation";
import { UpdateBrandData } from "../../CrudOperations/Update&Edit";

const AddBrand = ({ closeModal, onSubmit, Brand,onUpdate }) => {
console.log(closeModal);
console.log(onSubmit);
console.log(Brand);


  
  const [brand_name, setBrand_Name] = useState("");
  const [brand_description, setbrand_description] = useState("");
  const [status, setstatus] = useState("");

  // Populate fields if a Brand is being edited
  useEffect(() => {
    if (Brand) {
        setBrand_Name(Brand.brand_name);
        setbrand_description(Brand.brand_description);
        setstatus(Brand.status);
   
    } else {
      // Clear fields if adding a new Brand
      setBrand_Name("");
      setbrand_description("");
      setstatus("");
     
    }
  }, [Brand]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
        brand_name ,
        brand_description,
        status,
    };
    console.log(formData);

    console.log(Brand);
    
    

    try {
      let response;
      if (Brand) {
        console.log(Brand);
        // Update existing Brand
        response = await UpdateBrandData({id: Brand.id, formData});
        console.log(response);
        
        if (response?.data?.message === "brand updated successfully") {
          onUpdate(formData); // Handle updated data
          toast.success(response.data.message)
        }
             else{
               toast.error(response?.data?.message)
                toast.error(response?.data?.error)

        }
      } else {
        // Add new Brand
        console.log(Brand);
        response = await StoreBrand({formData});
        if (response.data.message == 'Brand saved successfully!') {

          setBrand_Name("")
   
          onSubmit(); // Handle new data
        }
        else{
               toast.error(response?.data?.message)
                toast.error(response?.data?.error)

        }
      }
      closeModal();
    } catch (error) {
      toast.error("Failed to save Brand. Please try again.");
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 ${'block' }`}>
      <div className="bg-white rounded-lg p-4 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-3">
          {Brand ? "Edit Brand" : "Add Brand"}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700">Brand Name</label>
            <input
              type="text"
              value={brand_name}
              onChange={(e) => setBrand_Name(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Description</label>
            <input
              type="text"
              value={brand_description}
              onChange={(e) => setbrand_description(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            />
          </div>

          <div className="mb-2">
  <label className="block text-gray-700">Status</label>
  <select
    className="shadow-md border border-gray-300 px-2 py-2 rounded-md text-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => setstatus(e.target.value)} // Corrected: Use a function in onChange
  >
    <option value="">Select Status</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>


      

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 px-3 py-1 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              {Brand ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;
