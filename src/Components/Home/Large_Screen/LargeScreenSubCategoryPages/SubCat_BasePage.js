import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import SubCatMegaMenu from "./SubCatMegaMenu";
import SubCatListing from "./SubCatListing";

const SubCat_BasePage = () => {
  const navigate = useNavigate();

  // Custom styles to hide navigation arrows
  const customCarouselStyles = `
    .p-carousel-prev, .p-carousel-next {
      display: none;
    }
  `;

  // Function to handle image click
  const handleImageClick = (banner) => {
    console.log(`Image ID clicked: ${JSON.stringify(banner.bannerId)}`);
    navigate(`/grocery/items`, { state: { bannerId: banner.bannerId } });
  };

  return (
    <div>
      <div>
        <SubCatMegaMenu />
      </div>

      <main className="bg-gradient-to-l from-slate-200 to-slate-100 min-h-screen p-6">
        {/* Apply custom styles */}
        <style>{customCarouselStyles}</style>

            <SubCatListing />


      </main>
    </div>
  );
};

export default SubCat_BasePage;
