import React from "react";
import Sidebar from "../Header&SideBar/Sidebar";
const StoreOffer = () => {
  // Mock data for store offers
  const storeOffers = [
    {
      storeName: "Store A",
      offer: "Flat 20% off on electronics",
    },
    {
      storeName: "Store B",
      offer: "Buy 1 Get 1 Free on clothing",
    },
    {
      storeName: "Store C",
      offer: "Special discount on groceries",
    },
  ];

  return (
    <div className="flex mt-14 xl:mt-0 gap-4 justify-center">
      {/* <Sidebar /> */}

      <div className="bg-white flex flex-col gap-4 border p-4 w-[1100px]">
        <h1 className="text-2xl font-bold">Store Offer</h1>
      {storeOffers.map((offer, index) => (
    <div key={index} className="border p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-2">{offer.storeName}</h3>
      <p>{offer.offer}</p>
    </div>
  ))}
        
      </div>
    </div>
  );
};

export default StoreOffer;



