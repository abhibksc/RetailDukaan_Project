import React from "react";
import Sidebar from "../Header&SideBar/Sidebar";

const SavedUPI = () => {
  return (
    <div className=" mt-14 xl:mt-0 flex gap-4 justify-center bg-gray-100 min-h-screen p-6">
      <Sidebar />

      {/* <div className="bg-white flex flex-col gap-4 border border-gray-300 rounded-lg shadow-lg p-6 w-[800px]">
        <h1 className="font-bold text-3xl text-blue-800">Manage Saved UPI</h1>

        <div className="flex flex-col gap-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h2 className="font-bold text-xl text-blue-600">Phonepe UPI</h2>
          <p className="text-gray-700">7992275028@ybl</p>
        </div>

        <div className="mt-4 flex flex-col gap-6">
          <h2 className="font-bold text-xl text-blue-600">FAQs</h2>
          <ul className="list-disc list-inside flex flex-col gap-6 text-gray-800">
            <li className="font-medium">Why is my UPI being saved on Flipkart?</li>
            <p>
              It's quicker. You can save the hassle of typing in the complete UPI information every time you shop at Flipkart by saving your UPI details. You can make your payment by selecting the saved UPI ID of your choice at checkout. While this is obviously faster, it is also very secure.
            </p>
            <li className="font-medium">Is it safe to save my UPI on Flipkart?</li>
            <p>
              Absolutely. Your UPI ID information is 100 percent safe with us. UPI ID details are non PCI compliant and are non confidential data.
            </p>
            <li className="font-medium">What all UPI information does Flipkart store?</li>
            <p>
              Flipkart only stores UPI ID and payment provider details. We do not store UPI PIN/MPIN.
            </p>
            <li className="font-medium">Can I delete my saved UPI?</li>
            <p>
              Yes, you can delete your UPI ID at any given time.
            </p>
          </ul>
          <a href="#" className="text-blue-500 hover:underline">View all FAQs</a>
        </div>
      </div> */}
    </div>
  );
};

export default SavedUPI;
