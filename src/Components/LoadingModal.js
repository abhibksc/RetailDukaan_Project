import React, { useEffect } from 'react';

const LoadingModal = () => {

   useEffect(() => {
      document.body.classList.add("modal-open");
      return () => {
        document.body.classList.remove("modal-open");
      };
    }, []);


  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-30 z-50">
      <div className=" p-6 rounded-lg shadow-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    </div>
  );
};

export default LoadingModal;
