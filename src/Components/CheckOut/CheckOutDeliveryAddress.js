import React, { use, useEffect, useState } from "react";
import AddressPopUp from "../ViewCart/AddressPopUp";
import { getAllAddress } from "../CrudOperations/GetOperation";
import { useLocation } from "react-router-dom";

const CheckOutDeliveryAddress = ({
  selectAddress,
  addresses,
  handleAddressChange,
  selectedAddress,
  OnUpdatePrimaryAddInCheckOut,
  isPaymentChanged,
  isAddModalopen
}) => {
  const [primary, setPrimary] = useState({
    name: "",
    pin_code: "",
    address_type: "",
    full_addresss: "",
  });
  const [addressPopUp, setAddressPopUp] = useState(false);
  const path = window.location.pathname;
  const location = useLocation();

  useEffect(() => {

    console.log(location.pathname);
    

    if (location.pathname.startsWith("/CheckOut/PaymentStatus-Check"))
      {

        isPaymentChanged();

      // setAddressPopUp(false);
    }
    else{

      setAddressPopUp(!addressPopUp);

    }
  }, [location.pathname]);

  useEffect(() => {
    if (addresses) {
      const primary_add = addresses.find((ele) => ele.primary_address == 1);
      console.log(primary_add);

      setPrimary(primary_add);
    }
  }, [addresses]);

  const handleAddresspopUp = () => {
    setAddressPopUp(!addressPopUp);
  };

  const OnUpdatePrimaryAdd = () => {
    OnUpdatePrimaryAddInCheckOut();
    // setAddressPopUp(false);
  };

  return (
    <>
      <div className="bg-white p-4 rounded shadow-md flex flex-col md:flex-row justify-between w-full mb-4">
        <div className="flex gap-3 w-full">
          <div>
            <h1 className="border p-1 h-6 w-5 text-[13px] bg-gray-200 text-blue-500 font-bold text-center">
              2
            </h1>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <span className="font-inter font-semibold text-gray-500">
              DELIVERY ADDRESS
            </span>

            {primary &&
              primary.name &&
              primary.address_type &&
              primary.full_addresss && (
                <div className="flex flex-col xl:flex-row justify-between items-start w-full ">
                  <div className="flex-1 text-gray-700">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm">Deliver to:</span>
                      <span className="font-bold text-black text-sm">
                        {`${primary.name}, ${primary.pin_code}`}
                      </span>
                      <span className="border bg-gray-200 font-inter text-xs px-2 py-1 rounded-md">
                        {primary.address_type}
                      </span>
                    </div>
                    <div className="text-sm mt-1">{primary.full_addresss}</div>
                  </div>

                  <div className="ml-4 mt-3 self-end  xl:mt-0">
                    <button
                      className="border px-2 text-blue-600"
                      // Uncomment and add handler function if needed
                      onClick={() => handleAddresspopUp()}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {addressPopUp && (
        <AddressPopUp
          Addresss={addresses}
          onclose={handleAddresspopUp}
          OnUpdatePrimaryAdd={OnUpdatePrimaryAdd}
          isPaymentChanged = {isPaymentChanged}
        />
      )}
    </>
  );
};

export default CheckOutDeliveryAddress;
