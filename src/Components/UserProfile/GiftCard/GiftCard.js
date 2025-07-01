import React, { useState } from "react";
import Sidebar from "../../Header&SideBar/Sidebar";
import GiftCardModal from "./Add_GiftCardModal";
import Buy_GiftCardMondal from "./Buy_GiftCardMondal";

const GiftCard = () => {
  const [hide, setHide] = useState(false);
  const [hide2, setHide2] = useState(false);

  const handleToggle = () => setHide(!hide);
  const handleToggle2 = () => setHide2(!hide2);

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-center mt-14 xl:mt-0">
      {/* <Sidebar /> */}

      <div className="flex flex-col gap-3 p-4 w-full lg:w-auto">
        <div className="flex flex-col bg-white gap-4 border p-4 w-[1100px]">
          <h1 className="font-bold text-2xl font-roboto">Add A Gift Card</h1>
          <p className="font-roboto text-sm text-gray-600">
            Gift Card number & PIN are sent to your email inbox
          </p>
          {!hide && (
            <h1
              className="font-roboto text-blue-600 font-bold cursor-pointer"
              onClick={handleToggle}
            >
              ➕ ADD GIFT CARD TO ACCOUNT
            </h1>
          )}
          {hide && <GiftCardModal toggle={handleToggle} />}
        </div>
        
        <div className="flex flex-col bg-white gap-4 border p-4 w-[1100px] mt-4 lg:mt-0">
          <h1 className="font-bold text-2xl font-roboto">Buy Gift Card</h1>
          <p className="font-roboto text-sm text-gray-600">
            Gift Card number & PIN will be sent to your email inbox after purchase
          </p>
          {!hide2 && (
            <h1
              className="font-roboto text-blue-600 font-bold cursor-pointer"
              onClick={handleToggle2}
            >
              ➕ BUY
            </h1>
          )}
          {hide2 && <Buy_GiftCardMondal toggle2={handleToggle2} />}
        </div>
      </div>
    </div>
  );
};

export default GiftCard;
