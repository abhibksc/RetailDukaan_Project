import React, { useEffect, useState } from "react";

const Loose_Specification = ({ existingData,onclose ,submission}) => {
  const [keyValuePairs, setKeyValuePairs] = useState([]); // To hold key-value pairs
  const [key, setKey] = useState(""); // To store the key input
  const [value, setValue] = useState(""); // To store the value input


  useEffect(()=>{
    if(existingData.length > 0){
        setKeyValuePairs(existingData)
    }
      },[existingData])

  // Handle the form submission for adding key-value pair
  const handleAddPair = () => {
    if (key && value) {
      setKeyValuePairs((prevPairs) => [...prevPairs, { key, value }]);
      setKey(""); // Clear the key input
      setValue(""); // Clear the value input
    }
  };

  // Handle delete of a key-value pair
  const handleDeletePair = (index) => {
    setKeyValuePairs((prevPairs) => prevPairs.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-2">
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
        onClick={onclose} // Close modal on clicking outside
      >
        <div
          className="bg-white p-6 rounded-lg w-2/6 max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Specifications</h2>
         <div className="flex gap-3">

         <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={()=>submission(keyValuePairs)}
            >
              Submit
            </button>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onclose}
            >
              Close
            </button>



         </div>
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-gray-700 font-medium"
              htmlFor="key"
            >
              Key:
            </label>
            <input
              type="text"
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="block w-full mb-4 text-sm text-gray-500 border p-2 rounded-md"
            />
            <label
              className="block mb-2 text-gray-700 font-medium"
              htmlFor="value"
            >
              Value:
            </label>
            <input
              type="text"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="block w-full mb-4 text-sm text-gray-500 border p-2 rounded-md"
            />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleAddPair}
            >
              Add Specification
            </button>
          </div>

          {/* Display key-value pairs */}
          {keyValuePairs.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold text-lg mb-2">Key-Value Pairs:</h3>
              <ul>
                {keyValuePairs.map((pair, index) => (
                  <li key={index} className="mb-2 mx-6 flex justify-between items-center">
                   <div>
                   <span className="font-semibold">{pair.key}:</span>{" "}
                   <span>{pair.value}</span>
                   </div>
                    <button
                      className="ml-4 text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePair(index)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loose_Specification;
