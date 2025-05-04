import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ProductSection from "../Productsection";
import HomeManagementCategory from "../HomeManagementCategory";
import { getdesktopUIMainBanner } from "../../CrudOperations/GetOperation";
import HomeManagementMobileCategory from "./HomeManagementMobileCategory";
import UiMobileHeader from "../../Header&SideBar/MobileHeader/UiMobileHeader";
import ShopByCategoryBase from "./ShopByCategory/ShopByCategoryBase";




const SmallScreenHomePage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Redux state selectors
  const email = useSelector((state) => state.auth.email);
  const registered = useSelector((state) => state.auth.registered);

  const dispatch = useDispatch();
  const [mainBannerImageList, setMainBannerImagesList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getdesktopUIMainBanner();
        console.log(response);

        if (
          response.data.message ===
          "Desktop main banners retrieved successfully."
        ) {
          console.log(response); // Log the data
          setMainBannerImagesList(response.data.MainBanner); // Update state with fetched banners
        }
      } catch (error) {
        console.error("Error fetching data:", error); // Handle errors
      }
    };

    fetchProducts(); // Call the async function
  }, []); // Empty dependency array to run once on mount

  // Effect to handle showing modal when registered state changes
  useEffect(() => {
    if (registered) {
      setShowModal(true);
    }
  }, [registered]);

  // Handler to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };


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

    <div className="flex  h-[calc(100vh-66px)] overflow-y-auto">
          < UiMobileHeader/>

          <main className="bg-white min-h-screen  py-6 overflow-auto">

{/* Apply custom styles */}
<style>{customCarouselStyles}</style>

<div className="w-full mt-12 border">
  <Carousel
    value={mainBannerImageList}
    numVisible={1}
    numScroll={1}
    itemTemplate={(banner) => (
      <div
        className=""
        onClick={() => handleImageClick(banner)} // Add onClick handler
      >
        <div>
          <img
            src={banner.image}
            alt="Carousel Image"
            className="rounded-md shadow-lg shadow-gray-400 md:w-full       cursor-pointer"
          />
        </div>
      </div>
    )}
    circular
    autoplayInterval={3000}
  />
</div>

{/* <ProductSection /> */}
<HomeManagementMobileCategory />

<ShopByCategoryBase />



















</main>
    </div>
  
  );
};

export default SmallScreenHomePage;
