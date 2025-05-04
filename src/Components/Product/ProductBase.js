import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductListingPage from "./Product_Listing_Page";
import SingleProductPage from "./Single_Product_page";

const ProductBase = () => {
  return (
    <div className="flex">
      <div className="w-full p-4">
        <Routes>
          <Route path="/" element={<ProductListingPage />} />

          <Route path="/:category" element={<ProductListingPage />} />
          <Route
            path="/:category/:subCategory"
            element={<ProductListingPage />}
          />
          <Route
            path="/:category/:subCategory/:productItem"
            element={<ProductListingPage />}
          />

          <Route
            path="/:category/:subCategory/:productItem/:item/:VariantId"
            element={<SingleProductPage />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default ProductBase;
