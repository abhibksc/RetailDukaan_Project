import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaLocationCrosshairs } from "react-icons/fa6";
import usePincodeEffect from "../../UseFullHooks/usePincodeEffect";
import { checkPincodeAvailability } from "../../CrudOperations/GetOperation";
import { updateAreaPin } from "../../ReduxStore/Slices/auth";
import { fetchHomeData } from "../../ReduxStore/Slices/homeSlice";
import { toast } from "react-toastify";


const SPincodeBox = () => {
  const [pincode, setPincode] = useState("");
  const { triggerPincodeEffect } = usePincodeEffect();
  const dispatch = useDispatch();

  const handleCheckPincode = async () => {
    if (!pincode || pincode.length !== 6) return;

    const result = await triggerPincodeEffect(pincode);
    if (result.status === "success") {

          const pincodeResponse = await checkPincodeAvailability(
              pincode
                );
        
                if (pincodeResponse?.data?.message === "Available") {
                  dispatch(updateAreaPin({ pincode: pincode }));
                  dispatch(fetchHomeData(pincode)); // where '110001' is the pincode
                } else {
                  toast.warn(
                    pincodeResponse?.data?.message || pincodeResponse?.data?.error
                  );
                }
    

    }
    else{

         toast.warn(result.message);


    }
  };

  return (
    <div className=" bg-gray-50 flex flex-col justify-start items-center pt-16 px-4">
      <div className="w-full min-w-full bg-white shadow-md rounded-xl p-5">
        <h1 className="font-inter text-lg font-semibold text-gray-800">
          Verify Delivery Pincode
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Only available in selected cities
        </p>

        <div className="flex items-center border border-red-500 rounded-lg mt-6 p-2">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="flex-1 px-2 focus:outline-none text-sm"
            placeholder="Enter pincode"
          />
          <div
            className="text-blue-600 flex items-center gap-1 text-sm cursor-pointer"
            onClick={handleCheckPincode}
          >
            <FaLocationCrosshairs />
            <span>Check</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPincodeBox;
