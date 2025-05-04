import React from "react";

const ViewSpecification = ({ onclose, Specifications }) => {
  return (
    <div className="mb-2">
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onclose} // Close modal on clicking outside
    >
      <div
        className="bg-white rounded-lg w-2/6 max-h-screen overflow-y-auto shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onclose} // Close modal on clicking the button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          ✖
        </button>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Specifications
          </h2>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left font-medium text-gray-600">
                  Key
                </th>
                <th className="p-3 text-left font-medium text-gray-600">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {Specifications.map((variant, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3 text-gray-700">{variant.key}</td>
                  <td className="p-3 text-gray-700">{variant.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ViewSpecification;
