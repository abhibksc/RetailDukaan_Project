import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MainGroupListing from "../MainGroupListing/MainGroupListing";
import HomeManagementCategory from "../../HomeManagementCategory";
import ProductSection from "../../Productsection";
import { getdesktopUIMainBanner } from "../../../CrudOperations/GetOperation";
import MegaMenu from "../../../Header&SideBar/MegaMenu";
import CategoryMegaMenu from "./CategoryMegaMenu";
import CategoryListings from "./CategoryListings";

const CategoryBasePage = () => {
  const navigate = useNavigate();


  // Custom styles to hide navigation arrows
  const customCarouselStyles = `
    .p-carousel-prev, .p-carousel-next {
      display: none;
    }
  `;

  // Function to handle image click
  const handleImageClick = (banner) => {
       (`Image ID clicked: ${JSON.stringify(banner.bannerId)}`);
    navigate(`/grocery/items`, { state: { bannerId: banner.bannerId } });
  };

  return (
    <div className="min-h-screen">
      <div>
        <CategoryMegaMenu />
      </div>

      <main className="bg-gradient-to-l from-slate-200 to-slate-100 p-6">
        {/* Apply custom styles */}

            <CategoryListings />


      </main>
    </div>
  );
};

export default CategoryBasePage;
