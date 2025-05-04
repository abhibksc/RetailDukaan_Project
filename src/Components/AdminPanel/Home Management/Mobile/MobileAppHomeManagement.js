import React, { useState } from "react";

const MobileAppHomeManagement = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const handleAddBanner = () => {
    // Logic to add a new banner
    alert("Add Banner functionality coming soon!");
  };

  const handleAddCategory = () => {
    // Logic to add a new category
    alert("Add Category functionality coming soon!");
  };

  const handleAddFeaturedProduct = () => {
    // Logic to add a new featured product
    alert("Add Featured Product functionality coming soon!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Home Page Management
      </h1>

      {/* Banners Management */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Banners</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700"
            onClick={handleAddBanner}
          >
            Add Banner
          </button>
        </div>
        {banners.length > 0 ? (
          <ul className="space-y-4">
            {banners.map((banner, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <span className="text-gray-800">{banner.name}</span>
                <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No banners added yet.</p>
        )}
      </section>

      {/* Categories Management */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
          <button
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700"
            onClick={handleAddCategory}
          >
            Add Category
          </button>
        </div>
        {categories.length > 0 ? (
          <ul className="space-y-4">
            {categories.map((category, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <span className="text-gray-800">{category.name}</span>
                <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No categories added yet.</p>
        )}
      </section>

      {/* Featured Products Management */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Featured Products</h2>
          <button
            className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow hover:bg-purple-700"
            onClick={handleAddFeaturedProduct}
          >
            Add Featured Product
          </button>
        </div>
        {featuredProducts.length > 0 ? (
          <ul className="space-y-4">
            {featuredProducts.map((product, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <span className="text-gray-800">{product.name}</span>
                <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No featured products added yet.</p>
        )}
      </section>
    </div>
  );
};

export default MobileAppHomeManagement;
