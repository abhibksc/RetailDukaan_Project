import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { useSelector, useDispatch } from "react-redux";
import { getdesktopUIMainBanner } from "../../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import ProductSection from "../Productsection";
import HomeManagementCategory from "../HomeManagementCategory";

const LargeScreenHomePage = () => {
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

        if (
          response.data.message ===
          "Desktop main banners retrieved successfully."
        ) {
          setMainBannerImagesList(response.data.MainBanner); // Update state with fetched banners
        }
      } catch (error) {
        toast.error(  response.data.message ||   response.data.error);

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
    <main className="bg-gradient-to-l from-slate-200 to-slate-100 min-h-screen p-6">
      {/* Apply custom styles */}
      <style>{customCarouselStyles}</style>

      <div className="w-full">
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
                  className="rounded-md shadow-lg shadow-gray-400 sm:w-[600px] md:w-full md:h-96 cursor-pointer"
                />
              </div>
            </div>
          )}
          circular
          autoplayInterval={3000}
        />
      </div>

      <ProductSection />
      <HomeManagementCategory />
    </main>
  );
};

export default LargeScreenHomePage;
