import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carausal = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="carousel-container p-5">
      <Slider {...settings}>
        <div className="p-4 bg-white shadow-md rounded-md">
          <img
            className="w-full h-40 object-cover rounded-md mb-4"
            src="https://via.placeholder.com/400x200"
            alt="Product"
          />
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Product Name</span>
            <span className="text-sm text-gray-500">Description lorem ipsum dolor sit amet.</span>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">$99.99</span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Add to Cart</button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <img
            className="w-full h-40 object-cover rounded-md mb-4"
            src="https://via.placeholder.com/400x200"
            alt="Product"
          />
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Product Name</span>
            <span className="text-sm text-gray-500">Description lorem ipsum dolor sit amet.</span>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">$99.99</span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Add to Cart</button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <img
            className="w-full h-40 object-cover rounded-md mb-4"
            src="https://via.placeholder.com/400x200"
            alt="Product"
          />
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Product Name</span>
            <span className="text-sm text-gray-500">Description lorem ipsum dolor sit amet.</span>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">$99.99</span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Add to Cart</button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <img
            className="w-full h-40 object-cover rounded-md mb-4"
            src="https://via.placeholder.com/400x200"
            alt="Product"
          />
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Product Name</span>
            <span className="text-sm text-gray-500">Description lorem ipsum dolor sit amet.</span>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">$99.99</span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Add to Cart</button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <img
            className="w-full h-40 object-cover rounded-md mb-4"
            src="https://via.placeholder.com/400x200"
            alt="Product"
          />
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Product Name</span>
            <span className="text-sm text-gray-500">Description lorem ipsum dolor sit amet.</span>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">$99.99</span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Add to Cart</button>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Carausal;
