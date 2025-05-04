import React from "react";
import { IoCloseOutline } from "react-icons/io5"; // Import close icon from React Icons

const OfferModal = ({ onClose }) => {
  console.log(onClose);
  // Replace with actual offer details
  const offerContent = "Get 20% off on all electronics!";

  return (
    <div className="fixed z-20 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            className="text-gray-700 hover:text-gray-900"
            onClick={()=>onClose()}
          >
            <IoCloseOutline className="text-2xl" /> {/* Close icon */}
          </button>
        </div>
        <div className="bg-blue-500 p-6 rounded-lg max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4">Latest Offer</h2>
          <p>{"offerContent"}</p>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
