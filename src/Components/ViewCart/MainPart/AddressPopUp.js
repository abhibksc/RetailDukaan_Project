import React, { useEffect, useState } from "react";
import { updateprimaryaddress } from "../../CrudOperations/Update&Edit";
import { useSelector } from "react-redux";
import { getAllAddress } from "../../CrudOperations/GetOperation";
import BillingSection from "../BillingSection/BillingSection";
import { toast } from "react-toastify";

const AddressPopUp = ({ onclose, OnUpdatePrimaryAdd,isPaymentChanged
 }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [Addresss, setAddresss] = useState([]);
  const [check, setCheck] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  useEffect(() => {
  
    const fetchAddresses = async () => {
      const addressResponse = await getAllAddress();
      if (addressResponse) {
        const addresses = addressResponse.data.addresses;
        setAddresss(addresses);

        // Set the default primary address
        const primaryAddress = addresses.find((ele) => ele.primary_address == 1);
        if (primaryAddress) {
          setSelectedAddress(primaryAddress);
        }
      }
    };

    fetchAddresses();
  }, []);



const handleSelect = async (address) => {
  setSelectedAddress(address); // Optimistically update UI

  try {
    const response = await updateprimaryaddress(address.id, token);
    console.log(response);

    if (
      response &&
      response?.data?.message === "Primary address updated and cart recalculated."
    ) {
      
      // onclose(); // Close popup/modal
    } else {
      toast.error(response?.data?.message || response?.data?.error || "Something went wrong.");
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to update address."
    );
  }
};



  const handleAddNewAddress = () => {
    onclose(); // Call the onClose function
    window.open("/profile/addresses", "_blank"); // Open new tab with the given link
};




  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center ">
      <div className="bg-white border p-5 w-full max-w-lg flex flex-col gap-4 rounded-lg shadow-lg mx-5 xl:mx-0">
  <div className="flex justify-between items-center">

  <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Select Delivery Address
        </h2>

        <div className="">
          <button  
          className="px-4 py-2 text-sm font-medium  border rounded-md hover:bg-blue-900 bg-blue-500 text-white"
          onClick={handleAddNewAddress}
          >

            Add
          </button>
        </div>

  </div>



  <ul className="space-y-4 overflow-y-auto max-h-80 p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
  {Addresss && Addresss.length > 0 ? (
    Addresss.map((address, index) => (
      <li
        key={index}
        className={`p-4 rounded-md border transition duration-300 ${
          selectedAddress && selectedAddress.id === address.id
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:shadow"
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="address"
            className="mt-1 accent-blue-500"
            checked={selectedAddress && selectedAddress.id === address.id} 
            onChange={() => handleSelect(address)} 
          />
          <div>
            <div className="font-medium text-gray-800">
              {address.name}, {address.pin_code} ({address.address_type})
            </div>
            <div className="text-sm text-gray-600">{address.full_addresss}</div>
          </div>
        </label>
      </li>
    ))
  ) : (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  )}
</ul>


        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 border rounded-md hover:bg-gray-100"
            onClick={()=>{onclose()
              isPaymentChanged && isPaymentChanged() 
            
                  // Reload page to update BillingSection.js
            }}
          >
            Deliver Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressPopUp;
