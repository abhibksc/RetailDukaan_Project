import React from "react";

const SNearbyItems = () => {
  const dummyItems = [
    { name: "Fresh Mangoes", img: "https://via.placeholder.com/80", desc: "Farm fresh", price: "₹99/kg" },
    { name: "Organic Milk", img: "https://via.placeholder.com/80", desc: "Delivered daily", price: "₹55/L" },
    { name: "Atta Pack", img: "https://via.placeholder.com/80", desc: "5kg Bag", price: "₹225" },
  ];

  return (
    <div className="px-4">
      <h2 className="font-semibold text-gray-800 text-md mb-3">Popular Nearby Items</h2>
      <div className="flex overflow-x-auto gap-4 scrollbar-hide">
        {dummyItems.map((item, idx) => (
          <div key={idx} className="min-w-[140px] bg-white shadow-sm rounded-lg p-3">
            <img src={item.img} alt={item.name} className="rounded-md w-full h-20 object-cover" />
            <p className="text-sm font-semibold mt-2">{item.name}</p>
            <p className="text-xs text-gray-500">{item.desc}</p>
            <p className="text-green-600 font-bold text-sm mt-1">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SNearbyItems;
