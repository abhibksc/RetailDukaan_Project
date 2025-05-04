import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Carausal from "./Carausal";
import Carausal2 from "./Carausal2";
import { useNavigate } from "react-router-dom";

const MobileView = () => {
  const navigate = useNavigate();
  // Sample data for grocery items and a deal
  const items = [
    {
      name: "Item Name",
      price: "$1,700",
      discountedPrice: "$300",
      quantity: 3,
      image: "https://via.placeholder.com/400x200",
    },
    {
      name: "Item Name",
      price: "$1,700",
      discountedPrice: "$300",
      quantity: 3,
      image: "https://via.placeholder.com/400x200",
    },
    // Add more items as needed
  ];

  const deal = {
    name: "Steal Deal Product",
    weight: "1 kg",
    expiry: "Expiry Date: 23 Feb 2026",
    image: "https://via.placeholder.com/400x200",
  };

  // Item component to render each grocery item
  const Item = ({ name, price, discountedPrice, quantity, image }) => (
    <li className="border-b-2 p-5 flex items-center">
      <img className="w-20 h-20 object-cover rounded-md mr-4" src={image} alt={name} />
      <div className="flex flex-col flex-1">
        <span className="font-semibold">{name}</span>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <span className="font-semibold text-xl">{price}</span>
            <span className="text-gray-500">{discountedPrice}</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">+</button>
            <span>{quantity}</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">-</button>
          </div>
        </div>
      </div>
    </li>
  );

  return (
    <div className="bg-gray-100">
      {/* Delivery Address */}
      <div className="w-full bg-white  p-5 mb-1 flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div>Deliver to: Abhishek, 834001</div>
          <div>Full Address</div>
        </div>
        <button className="p-2 border">Change</button>
      </div>

      {/* Add More Grocery Items */}
      <div className="w-full bg-white p-5 mb-4 flex justify-between items-center">
        <div>Add More Grocery Items</div>
        <MdKeyboardArrowRight className="text-3xl" />
      </div>

      {/* List of Items */}
      <ul className="w-full bg-white p-5 mb-4">
        {items.map((item, index) => (
          <Item key={index} {...item} />
        ))}
      </ul>

      {/* Super Deals */}
      <div className="w-full bg-white p-5 mb-4">
        <div className="flex items-center mb-3">
          <span className="bg-green-700 text-white px-2 py-1 rounded-sm">STEAL DEALS</span>
          <span className="ml-2">Limited Period Offers</span>
        </div>
        <div className="flex items-center border p-3 rounded-md">
          <img className="w-24 h-24 object-cover rounded-md mr-4" src={deal.image} alt={deal.name} />
          <div className="flex flex-col">
            <span className="font-semibold">{deal.name}</span>
            <span>{deal.weight}</span>
            <span>{deal.expiry}</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Add | +</button>
          </div>
        </div>
      </div>

      {/* Quick Grabs */}
      <div className="w-full bg-white p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="font-semibold">Quick Grabs</div>
          <div className="text-blue-500">View All</div>
        </div>
        <Carausal />
      </div>


       {/* Items You Have missed */}
       <div className="w-full bg-white p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="font-semibold">Item You May Have missed</div>
        </div>
        <Carausal2 />
      </div>


      {/* Price Details Section */}
      <div className="bg-white mb-20 px-5 p-5">
        <h2 className="text-lg font-semibold mb-3">PRICE DETAILS</h2>
        <div className="flex justify-between mb-2">
          <span>MRP (2 items)</span>
          <span>₹2,405</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Product Discount</span>
          <span>− ₹586</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Coupons for you</span>
          <span>− ₹88</span>
        </div>
        <div className="flex justify-between mb-4 ">
          <span>Delivery Fee</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between mb-2 border-t-2 border-b-2 p-2">
          <span>Total Amount</span>
          <span>₹1,731</span>
        </div>
        <div className="text-green-600">
          You will save ₹683 on this order
        </div>
      </div>




      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-3 border-t border-gray-300">


        <div className="flex justify-between">
          <span className="self-center text-[20px]">₹2,405</span>


        <button onClick={()=>navigate("/viewCart/Checkout/summary")} className="p-3 bg-orange-600 text-white">
          Continue
        </button>



        </div>
      


      
      </div>






    </div>
  );
};

export default MobileView;
