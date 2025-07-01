import React from "react";
import Sidebar from "../Header&SideBar/Sidebar";

const MyWhishlist = () => {
  return (
    <div className="flex gap-4 mt-14 xl:mt-0 justify-center p-6 bg-gray-100">
      {/* <Sidebar /> */}

      <div className="bg-white flex flex-col gap-4 border border-gray-300 p-6 w-[1100px] rounded-lg shadow-md">
        <h1 className="font-bold text-2xl text-blue-700">My Wishlist</h1>
        <div className="text-gray-600 text-center">Your wishlist is empty. Add items to your wishlist to see them here.</div>
        
        <div className="flex flex-col items-center mt-8">
          <img src="https://via.placeholder.com/150" alt="Empty Wishlist" className="mb-4" />
          <p className="text-gray-500">Start adding your favorite items to the wishlist and they will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default MyWhishlist;
