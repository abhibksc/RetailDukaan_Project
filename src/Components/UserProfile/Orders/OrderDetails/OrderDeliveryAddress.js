import React from "react";
import { useParams } from "react-router-dom";
import Invoice from "./Invoice";

const OrderDeliveryAddress = ({ delivery_Addresss_data }) => {
  // Destructure the delivery address data
  const {
    name,
    full_addresss,
    landmark,
    locality,
    city,
    state,
    pin_code,
    phone,
    alternate_phone,
    email,
    address_type,
  } = delivery_Addresss_data || {};

  const { orderId } = useParams(); // Retrieves the dynamic orderId from the URL

  console.log(orderId);

  return (
    <div className="bg-white px-5 flex justify-between  py-3">


    <div className="w-3/12   font-extralight ">

    <h2 className="text-[15px] font-bold mb-4">Delivery Address</h2>

<div className="mb-6 flex flex-col gap-3">
  <p className="font-semibold text-[14px] text-gray-800">{name}</p>
  <p  className=" text-[13px] text-gray-700">
    {full_addresss}, {landmark}, {locality}, {city}, {state} - {pin_code}
  </p>
  <p className=" text-[13px] text-gray-700"><span className="font-bold text-gray-800" >Phone number: </span>{phone}</p>


  {/* <button className="mt-3 text-blue-500 hover:underline">Change</button> */}
</div>



    </div>

    <div>
    <Invoice orderID={orderId}/>
    </div>
    </div>
  );
};

export default OrderDeliveryAddress;
