// EmptyState.js
import React from 'react';
import Lottie from 'react-lottie';


import animationData from '../../assets/animations/Emptylist.json'; // Adjust the path if necessary




const EmptyState = ({ children }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <Lottie options={defaultOptions} height={200} width={200} />
      {/* Render the custom content passed as children */}
      {children}
      {/* <h2 className="mt-4 text-xl font-semibold text-gray-800">
        No Items Found
      </h2>
      <p className="mt-2 text-gray-500">
        Looks like you don't have any items in this section.
        Add some to get started!
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
        Add New Item
      </button> */}
    </div>
  );
};





export default EmptyState;
