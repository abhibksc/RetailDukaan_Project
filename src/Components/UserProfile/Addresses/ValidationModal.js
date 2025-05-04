import { useEffect } from "react";

const ValidationModal = ({ onClose }) => {

    
      useEffect(() => {
        document.body.classList.add("modal-open");
        return () => {
          document.body.classList.remove("modal-open");
        };
      }, []);


    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="bg-white p-6  shadow-lg w-96 flex flex-col gap-4">
          <h2 id="modal-title" className="text-md  text-gray-800">
            Sorry, we could not find the location. Please locate on the map or use your current location.
          </h2>
          <button
            onClick={onClose} // Use the correct prop here
            className="py-1 px-6  text-red-500 bg-white shadow-lg hover:bg-red-100 "
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  export default ValidationModal;
  