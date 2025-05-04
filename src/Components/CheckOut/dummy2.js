import React, { useState } from "react";
import CheckOutLogin from "./CheckOutLogin";
import CheckOutDeliveryAddress from "./CheckOutDeliveryAddress";
import CheckOutOrderSummary from "./CheckOutOrderSummary";
import CheckOutPaymentOrder from "./CheckOutPaymentOrder";

const CheckOut = () => {
  const [isLoginChanged, setIsLoginChanged] = useState(false);
  const [selectAddreess, setselectAddreess] = useState(false);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isPaymentChanged, setIsPaymentChanged] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const name = "John Doe";
  const phones = "1234567890";

  const addresses = [
    "123 Main St, Anytown, USA",
    "456 Maple Ave, Anytown, USA",
    "789 Oak Dr, Anytown, USA",
  ];

  const handleLoginChange = () => setIsLoginChanged(!isLoginChanged);
  const handleAddressChange = (event) => setSelectedAddress(event.target.value);
  const handleOrderChange = () => setIsOrderChanged(!isOrderChanged);
  const handlePaymentChange = () => setIsPaymentChanged(!isPaymentChanged);

  return (
    <div className=" w-full">
      <nav className="bg-green-600 p-3 pl-40 w-full">
        <h1 className="font-roboto font-semibold text-2xl text-white">Grocery</h1>
      </nav>
      <div className="flex justify-center border">
        <div className="p-6 rounded">
          <CheckOutLogin
            isLoginChanged={isLoginChanged}
            name={name}
            phones={phones}
            handleLoginChange={handleLoginChange}
          />
          <CheckOutDeliveryAddress
            selectAddreess={selectAddreess}
            addresses={addresses}
            handleAddressChange={handleAddressChange}
            selectedAddress={selectedAddress}
          />
          <CheckOutOrderSummary
            isOrderChanged={isOrderChanged}
            handleOrderChange={handleOrderChange}
          />
          <CheckOutPaymentOrder
            isPaymentChanged={isPaymentChanged}
            handlePaymentChange={handlePaymentChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
