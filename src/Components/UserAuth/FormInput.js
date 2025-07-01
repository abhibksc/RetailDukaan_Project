// FormInput.js
import React, { useEffect } from "react";

const FormInput = ({ label, type = "text", value, onChange, placeholder, className = "", ...rest }) => {



  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...rest}
      />
    </div>
  );
};

export default FormInput;
