import React, { useState } from "react";
import { Carousel } from "primereact/carousel";

const MobileCategoryHeader = () => {
  // State to manage which category is open
  const [openCategory, setOpenCategory] = useState(null);

  // Function to toggle category
  const handleToggle = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const images = [
    { src: "https://proveeraexports.com/assets/img/fb/18.jpg", title: "Staples" },
    { src: "https://proveeraexports.com/assets/img/fb/4.jpg", title: "Snacks & Beverages" },
    { src: "https://www.rmemart.com/s/62afda9f5dd6de16b52ff6be/62d21df9d8803c2722c58bda/baby-care-kit-1-1458x320.webp", title: "Baby Care" },
    // { src:  "https://rukminim2.flixcart.com/flap/128/128/image/ac8550.jpg?q=100", title: "Energy Drinks" },
    // { src: "https://rukminim2.flixcart.com/flap/128/128/image/ac8550.jpg?q=100", title: "Cleaners" },
  ];

  // Carousel responsive options
  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
   
  ];

  return (
    <>
      <nav className="  xl:hidden bg-gray-300 py-2 px-2 ">
      <h1 className="text-center text-[23px] font-inter mt-5 mb-5 md:mt-14 font-bold    p-1 rounded-md shadow-inner   text-gray-700 ">CATEGORY</h1>

          <Carousel
          className=""
            value={images}
            numVisible={1}
            numScroll={1}
            responsiveOptions={responsiveOptions}
            itemTemplate={(image) => (
              <div className=" text-center flex gap-2  ">
                
                <div>
                  <img
                    src={image.src}
                    alt={image.title}
                    className="    object-cover rounded-md shadow-md shadow-black"
                  />
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">{image.title}</h3>
                  </div>
                </div>
              </div>
            )}
            circular
            autoplayInterval={3000}
          />
      </nav>
    </>
  );
};

export default MobileCategoryHeader;
