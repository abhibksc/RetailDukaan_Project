import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UpdatePurchaseData, UpdateUnitData } from "../../CrudOperations/Update&Edit";
import { StorePurchase, Storeunit } from "../../CrudOperations/PostOperation";
import { getAllUnit } from "../../CrudOperations/GetOperation";

const AddunitModal = ({ closeModal, onSubmit, UnitData, onUpdate }) => {
  console.log(closeModal);
  console.log(onSubmit);
  console.log(UnitData);

  const [unit, setunit] = useState("");
  const [value, setValue] = useState("");
  const [parent_id, setParent_id] = useState("");


  const [parentOptions, setParentOptions] = useState([]);


  // Populate fields if a Brand is being edited




  useEffect(() => {
    const fetchunit = async () => {
      const response = await getAllUnit();
      console.log(response);
      
      if (response.data.message === "All unit retrieved successfully!") {

        setParentOptions(response.data.data)

  
      }
    };
    fetchunit();
  }, []);




  useEffect(() => {
    if (UnitData) {
      setunit(UnitData.unit);
      setValue(UnitData.value);
      setParent_id(UnitData.parent_id);
    } else {
      // Clear fields if adding a new Brand
      setunit("");
      setValue("");
      setParent_id("");
    }
  }, [UnitData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      unit,
      value,
      parent_id,
    };
    console.log(formData);

    console.log(UnitData);

    try {
      let response;
      if (UnitData) {
        console.log(UnitData);
        // Update existing Brand
        response = await UpdateUnitData({ id: UnitData.id, formData });
        console.log(response);

        if (response.data.message === "unit updated successfully") {



          onUpdate(formData); // Handle updated data
          toast.success(response.data.message);
        }
      } else {
        // Add new Brand
        console.log(UnitData);
        response = await Storeunit({ formData });
        if (response.data.message === "Unit saved successfully!") {
          const newBrand = { ...formData, id: response.data.data.id };
          onSubmit(newBrand); // Handle new data
        }
      }
      closeModal();
    } catch (error) {
      toast.error("Failed to save Brand. Please try again.");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 ${"block"}`}
    >
      <div className="bg-white rounded-lg p-4 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-3">
          {UnitData ? "Edit Unit" : "Add Unit"}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700">Units</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setunit(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Parent</label>
            <select
              value={parent_id}
              onChange={(e) => setParent_id(e.target.value)}
              className="border border-gray-300 p-1 w-full rounded-md"
            >
              <option value="">Select Parent</option> {/* Default option */}
              {/* Replace the following array with your dynamic data */}
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.unit}{" "}
                  {/* Adjust this to display the appropriate name or value */}
                </option>
              ))}
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
              {UnitData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddunitModal;
