import React, { useState } from "react";
import MainBanner from "./MainBanner";
import FeaturedBanner from "./FeaturedBanner";
import CategoryManagement from "./CategoryManagement";
import BackButton from "../../../BackButton";

const DesktopHomeManagement = () => {
  const [activeSection, setActiveSection] = useState("Main Banner");

  return (
    <div className="mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Home Page Management
      </h1> */}
         <BackButton className="mb-4" />

      {/* Section Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveSection("Main Banner")}
          className={`px-4 py-2 rounded ${
            activeSection === "Main Banner"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Main Banner
        </button>
        <button
          onClick={() => setActiveSection("Featured Banner")}
          className={`px-4  rounded ${
            activeSection === "Featured Banner"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Featured Banner
        </button>
        <button
          onClick={() => setActiveSection("Categories")}
          className={`px-4 py-2 rounded ${
            activeSection === "Categories"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Categories
        </button>

        <button
          onClick={() => setActiveSection("Store")}
          className={`px-4 py-2 rounded ${
            activeSection === "Store"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Store
        </button>


      </div>

      {/* Section Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeSection === "Main Banner" && (
   <MainBanner/>
        )}
        {activeSection === "Featured Banner" && (

          <FeaturedBanner/>
        )}
        {activeSection === "Categories" && (
          <CategoryManagement/>
        )}

{activeSection === "Store" && (
          <CategoryManagement/>
        )}
      </div>
    </div>
  );
};

export default DesktopHomeManagement;
