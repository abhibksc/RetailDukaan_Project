import React from "react";

const ViewImages = ({ onclose, ImageView }) => {
  return (
    <div className="mb-2">
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
        onClick={onclose} // Close modal on clicking outside
      >
        <div
          className="bg-white rounded-lg w-3/6 max-h-screen overflow-y-auto shadow-lg relative"
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        >
          {/* Close Button */}
          <button
            onClick={onclose} // Close modal on clicking the button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            ✖
          </button>

          {/* Modal Content */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">
              Uploaded Images
            </h2>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ImageView.map((image, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-lg"
                >
                  {/* Image */}
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />

                  {/* Image Number (Overlay) */}
                  <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-60 text-white text-sm p-1">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImages;
