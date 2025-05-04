import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllActivePincodes } from "../../../CrudOperations/GetOperation";
import { AddDeliveryDate } from "../../../CrudOperations/PostOperation";

// Modal Component
const AddDeliveryDates = ({ closeModal, onSubmit }) => {
  const [pincode, setPincode] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [time, setTime] = useState("");
  const [pincodeList, setPincodeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPinExists, setIsPinExists] = useState(false);

  useEffect(() => {
    const fetchPincodes = async () => {
      setIsLoading(true);
      try {
        const result = await getAllActivePincodes();
        if (result.data.message === "All Available pincodes retrieved successfully!") {
          setPincodeList(result.data.data);
        } else {
          toast.error("Failed to retrieve pincodes. Token might be missing.");
        }
      } catch (error) {
        toast.error("Error fetching pincodes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPincodes();
  }, []);

  const handlePincodeChange = (e) => {
    const selectedPincode = e.target.value;
    setPincode(selectedPincode);
    setIsPinExists(pincodeList.some((pin) => pin.pincode === selectedPincode));
  };

  const handleDeliveryDate = async (e) => {
    e.preventDefault();
    const formData = { pincode, noOfDays, time };
    try {
      const response = await AddDeliveryDate(formData);
      if (response.data.message == "Delivery Date saved successfully!") {
        toast.success("Delivery date saved successfully!");
        onSubmit();
      } else {
        toast.error("Failed to add Delivery Date. Please try again.");
      }
    } catch (error) {
      toast.error("Error saving delivery date.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Delivery Date</h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading pincodes...</p>
        ) : (
          <form onSubmit={handleDeliveryDate}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Pincode</label>
              <select
                value={pincode}
                onChange={handlePincodeChange}
                className="border border-gray-300 p-2 w-full rounded-md"
                required
              >
                <option value="" disabled>
                  Select Pincode
                </option>
                {pincodeList.map((pin) => (
                  <option value={pin.pincode} key={pin.pincode}>
                    {pin.pincode}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">No. of Days</label>
              <input
                type="number"
                value={noOfDays}
                onChange={(e) => setNoOfDays(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-md"
                required
                disabled={!isPinExists}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-md"
                required
                disabled={!isPinExists}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  isPinExists ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
                }`}
                disabled={!isPinExists}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDeliveryDates;
