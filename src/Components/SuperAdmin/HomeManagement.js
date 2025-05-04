import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa"; // Icon for upload
import { uploadLogo } from "../CrudOperations/PostOperation";
import { GetLogo } from "../CrudOperations/GetOperation";
import { toast } from "react-toastify";

const HomeManagement = () => {
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

  // Fetch existing logo from backend
  useEffect(() => {

    const getLogoResonse = async () => {

    const dataresponse = await GetLogo();
    console.log(dataresponse.data.logo_url);
    setLogoUrl(dataresponse.data.logo_url); // Set the logo URL in state

    


    }

    getLogoResonse();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  // Upload logo to Laravel backend
  const handleUpload = async () => {
    console.log("Uploading logo...");
  
    if (!logo) {
      alert("Please select a logo first!");
      return;
    }
  
    try {
      const response = await uploadLogo(logo);
  
      if (response?.logo_url) {
        setLogoUrl(response.logo_url); // Update state
        setLogoUrl(response.logo_url); // Set the logo URL in state

        toast.success("Logo uploaded successfully!"); // Show success message
      } else {
        toast.error("Failed to upload logo. Please try again.");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Upload Your Logo
        </h1>

        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
          <label className="cursor-pointer">
            <input type="file" onChange={handleFileChange} className="hidden" />
            <div className="flex flex-col items-center">
              <FaCloudUploadAlt className="text-4xl text-blue-500 mb-2" />
              <span className="text-gray-600">Click to select a file</span>
            </div>
          </label>
        </div>

        <button
          onClick={handleUpload}
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Upload Logo
        </button>

        {logoUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700">Uploaded Logo:</h2>
            <div className="mt-3">
              <img
                src={logoUrl}
                alt="Uploaded Logo"
                className="h-24 w-auto mx-auto border rounded-lg shadow"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeManagement;
