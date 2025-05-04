import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ItemsSidebar = ({ brands, onBrandChange }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (accordion) => {
    setActiveAccordion(activeAccordion === accordion ? null : accordion);
  };

  return (
    <div className="w-64 hidden lg:flex flex-col gap-4 bg-white shadow-lg rounded-lg py-4 px-5">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Filters</h2>

      {/* Brand Filter */}
      <div className="pb-2 border-b">
        <button
          className="w-full text-left flex justify-between items-center font-semibold py-2 px-3 text-gray-700 transition hover:bg-gray-100 rounded-lg"
          onClick={() => toggleAccordion("brand")}
        >
          Brand
          {activeAccordion === "brand" ? (
            <FaChevronUp className="text-gray-600" />
          ) : (
            <FaChevronDown className="text-gray-600" />
          )}
        </button>
        <div
          className={`pl-4 overflow-hidden transition-all duration-300 ${
            activeAccordion === "brand" ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {brands.map((brand, index) => (
            <label key={index} className="flex items-center py-1 text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                onChange={() => onBrandChange(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Customer Ratings Filter */}
      <div className="pb-2 border-b">
        <button
          className="w-full text-left flex justify-between items-center font-semibold py-2 px-3 text-gray-700 transition hover:bg-gray-100 rounded-lg"
          onClick={() => toggleAccordion("ratings")}
        >
          Customer Ratings
          {activeAccordion === "ratings" ? (
            <FaChevronUp className="text-gray-600" />
          ) : (
            <FaChevronDown className="text-gray-600" />
          )}
        </button>
        <div
          className={`pl-4 overflow-hidden transition-all duration-300 ${
            activeAccordion === "ratings" ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <label className="flex items-center py-1 text-sm text-gray-600">
            <input
              type="radio"
              name="ratings"
              className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
            />
            4 Stars & Up
          </label>
          <label className="flex items-center py-1 text-sm text-gray-600">
            <input
              type="radio"
              name="ratings"
              className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
            />
            3 Stars & Up
          </label>
        </div>
      </div>

      {/* Discount Filter */}
      <div className="pb-2">
        <button
          className="w-full text-left flex justify-between items-center font-semibold py-2 px-3 text-gray-700 transition hover:bg-gray-100 rounded-lg"
          onClick={() => toggleAccordion("discount")}
        >
          Discount
          {activeAccordion === "discount" ? (
            <FaChevronUp className="text-gray-600" />
          ) : (
            <FaChevronDown className="text-gray-600" />
          )}
        </button>
        <div
          className={`pl-4 overflow-hidden transition-all duration-300 ${
            activeAccordion === "discount" ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <label className="flex items-center py-1 text-sm text-gray-600">
            <input
              type="radio"
              name="discount"
              className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
            />
            20% Off & Above
          </label>
          <label className="flex items-center py-1 text-sm text-gray-600">
            <input
              type="radio"
              name="discount"
              className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
            />
            30% Off & Above
          </label>
        </div>
      </div>

      {/* Add more filter sections if needed */}
    </div>
  );
};

export default ItemsSidebar;
