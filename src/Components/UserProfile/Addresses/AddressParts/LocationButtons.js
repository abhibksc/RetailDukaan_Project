import React from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";

const LocationButtons = ({ onCurrentLocationClick, onMapLocateClick }) => {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        className="border w-60 bg-blue-400 p-2 rounded-sm shadow-sm flex gap-2 items-center justify-center text-white"
        onClick={onCurrentLocationClick}
      >
        <FaLocationCrosshairs />
        Use My Current Location
      </button>

      <span className="mt-2">or</span>

      <button
        type="button"
        className="border w-60 bg-green-500 p-2 rounded-sm shadow-sm flex gap-2 items-center justify-center text-white"
        onClick={onMapLocateClick}
      >
        <FaLocationCrosshairs />
        Locate on Map
      </button>
    </div>
  );
};

export default LocationButtons;
