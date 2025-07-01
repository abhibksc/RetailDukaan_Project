import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductListingPage from "./Product_Listing_Page";
import Single_Product_page from "./Single_Product_page";
import ProductDetails from "./ProductDetails/ProductDetails";

const ProductBase = () => {
  return (
    <div className="flex mt-20">
      <div className="w-full p-2">
        <Routes>

               <Route path="items" element={<ProductListingPage />} />


          <Route path="/:pincode" element={<ProductListingPage />} />
          <Route path="/:groupName/:group_id/:pincode" element={<ProductListingPage />} />
          <Route
            path="/:groupName/:group_id/:categoryName/:category_id/:pincode"
            element={<ProductListingPage />}
          />
          <Route
            path="/:groupName/:group_id/:categoryName/:category_id/:subCategoryName/:subCategory_id/:pincode"
            element={<ProductListingPage />}
          />
          <Route
            path="/:groupName/:group_id/:categoryName/:category_id/:subCategoryName/:subCategory_id/:subSubCategoryName/:subSubCategory_id/:pincode"
            element={<ProductListingPage />}
          />





         <Route
  path="/:groupName/:group_id/:categoryName/:category_id/:subCategoryName/:subCategory_id/:subSubCategoryName/:subSubCategory_id/:item_id/:sku_id/:Varient_type/:purchase_item_id/:stock_id/:area_pin"
  element={<ProductDetails />}

/>

{/* ProductDetails */}

        </Routes>
      </div>
    </div>
  );
};

export default ProductBase;
