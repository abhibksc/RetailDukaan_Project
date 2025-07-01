import { useNavigate } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { useSelector } from "react-redux";
import SGroupMegaMenu from "./SGroupMegaMenu";
import SMainGroupListing from "./SMainGroupListing";

const SGroupBasePage = () => {
  const navigate = useNavigate();


  const groupLists = useSelector((state) => state.homeSlice_reducer.mainBanner);


  const customCarouselStyles = `
    .p-carousel-prev, .p-carousel-next {
      display: none;
    }
  `;

  // Function to handle image click
  const handleImageClick = (banner) => {
       (`Image ID clicked: ${JSON.stringify(banner.bannerId)}`);
    navigate(`/product/items`, { state: { bannerId: banner.bannerId } });
  };

  return (
    <div>
      <div>
        <SGroupMegaMenu />
      </div>

      <main className="bg-gradient-to-l from-slate-200 to-slate-100 min-h-screen p-6">
        <style>{customCarouselStyles}</style>

        <div className="w-full">
          <Carousel
            value={groupLists}
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

        <SMainGroupListing />

        {/* <ProductSection /> */}
        {/* <HomeManagementCategory /> */}
      </main>
    </div>
  );
};

export default SGroupBasePage;
