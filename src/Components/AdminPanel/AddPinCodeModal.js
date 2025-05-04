import { useState } from "react";
import { AddPinCode } from "../CrudOperations/PostOperation";
import { VerifyPinCode } from "../CrudOperations/GetOperation";
import { toast } from "react-toastify";

// Modal Component
const AddPinCodeModal = ({ isOpen, closeModal, onSubmit }) => {
  console.log("open ADdpinCodemodal");

  const [district_name, setdistrict_name] = useState("");
  const [pincode, setpincode] = useState("");
  const [Area, setArea] = useState("");
  const [state_name, setstate_name] = useState("");
  const [country_name, setcountry_name] = useState("");
  const [Status, setStatus] = useState("");

  const [checkResult, setCheckResult] = useState("");
  const [isPinExists, setIsPinExists] = useState(false); // New state variable

  const handleAddPincode = async (e) => {
    e.preventDefault();

    const formData = {
      district_name,
      pincode,
      Area,
      state_name,
      country_name,
      Status,
    };

    const response = await AddPinCode({ formData });

    if (response.data.message === "Pincode saved successfully!") {
      const newPincode = { ...formData, id: response.data.data.id };
      console.log(newPincode);

      onSubmit(newPincode); // Handle the form data
      closeModal();
    } else {
      toast.error("Failed to add pincode. Please try again.");
    }
  };

  const checkAreaPin = async () => {
    const result = await VerifyPinCode(pincode);
    console.log(result);

    if (result) {
      if (result.data.message === "Pincode Not Exists") {
        setIsPinExists(true); // Pin exists
      } else if (result.data.message === "Pincode Exists") {
        console.log("han bhai chal to raha hai");

        toast.warn("Pincode Exists");
      }
    } else {
      setCheckResult("Failed to check pin: Token might be missing.");
      setIsPinExists(false); // Set to false on error
    }
  };

  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add District and Pincode</h2>
        <form onSubmit={handleAddPincode}>
          <div className="mb-4">
            <label className="block text-gray-700">Pincode</label>
            <input
              type="text"
              value={pincode}
              disabled={isPinExists}
              onChange={(e) => {
                const value = e.target.value;

                // Allow only numbers and restrict to 6 digits
                if (/^\d{0,6}$/.test(value)) {
                  setpincode(value);
                }
              }}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />

            <button
              type="button"
              onClick={checkAreaPin}
              className="mt-2 bg-blue-600 text-white px-2 py-1 rounded-md"
            >
              Check
            </button>

            {/* Display the result of the check */}
            {checkResult && (
              <div
                className={`mt-2 ${
                  checkResult.includes("does not")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {checkResult}
              </div>
            )}
          </div>

          {isPinExists && (
            <div className="mb-4">
              <label className="block text-gray-700">Area</label>
              <input
                type="text"
                value={Area}
                onChange={(e) => setArea(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-md"
                required
              />
            </div>
          )}

          {/* Conditional Inputs */}
          {isPinExists && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">District</label>
                <input
                  type="text"
                  value={district_name}
                  onChange={(e) => setdistrict_name(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">State Name</label>
                <input
                  type="text"
                  value={state_name}
                  onChange={(e) => setstate_name(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Country Name</label>
                <input
                  type="text"
                  value={country_name}
                  onChange={(e) => setcountry_name(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  value={Status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="shadow-md border border-gray-300 px-2 py-2 rounded-md text-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select Area
                  </option>
                  <option value="Available">Accessible</option>
                  <option value="Not Available">Not Accessible</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 px-4 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={!isPinExists} // Disable submit if pin exists
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPinCodeModal;
