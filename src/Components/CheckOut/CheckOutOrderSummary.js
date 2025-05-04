import React, { useState } from "react";
import ItemsPopUp from "./ItemsPopUp";
import { useSelector } from "react-redux";

const CheckOutOrderSummary = ({ isOrderChanged, handleOrderChange }) => {

      const [View, setView] = useState(false);
      const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
      
  return (
    <>
      <div className="bg-white p-4 rounded shadow-md flex flex-row justify-between mb-4">
      <div className="flex gap-3">
        <div>
          <h1 className="border p-1 h-6 w-5 text-[13px] bg-gray-200 text-blue-500 font-bold">
            3
          </h1>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-inter font-semibold text-gray-500">
            ORDER SUMMARY
          </span>

          <span className="font-inter  text-black">
        {`Grocery Basket (${reduxcartItems.data && reduxcartItems.data.length} items)`}
          </span>


        </div>
      </div>

      <div>
        <button
          onClick={()=>setView(!View)}
          className="border px-2 text-blue-600"
        >
          View
        </button>
      </div>
    </div>


    {View && (
          <ItemsPopUp
            // Items={Items}
            updateClose={()=>setView(!View)}
            // OnUpdatePrimaryAdd={OnUpdatePrimaryAdd}
          />
        )}
    
  </>);
};

export default CheckOutOrderSummary;
