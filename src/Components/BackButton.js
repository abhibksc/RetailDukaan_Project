import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  return (
    <button
      onClick={() => navigate(-1)} // Go back to the previous page
      className={`flex items-center space-x-2 p-2 text-gray-600 hover:text-black transition duration-300 ${className}
      
      
      
  
      
      
      
      
      `}
    >
      <ArrowLeft
        className={`  ${
          windowWidth < 200
            ? "w-3 h-3 mt-1"
            : windowWidth < 300
            ? "w-4 h-4 mt-1"
            : windowWidth < 400
            ? "w-5 h-5 mt-1"
            : windowWidth < 500
            ? "w-6 h-6 mt-1"
            : windowWidth < 600
            ? "w-6 h-6 mt-1"
            : windowWidth < 700
            ? "w-7 h-7 mt-1"
            : windowWidth < 800
            ? "w-14 h-14"
            : windowWidth < 900
            ? "w-15 h-15"
            : windowWidth < 1000
            ? "w-16 h-16"
            : ""
        }  rounded-sm `}
      />
      {/* <span className="text-sm font-medium">Back</span> */}
    </button>
  );
};

export default BackButton;
