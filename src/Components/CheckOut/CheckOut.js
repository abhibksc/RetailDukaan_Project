import React, { useEffect, useState } from "react";
import CheckOutLogin from "./CheckOutLogin";
import CheckOutDeliveryAddress from "./CheckOutDeliveryAddress";
import CheckOutOrderSummary from "./CheckOutOrderSummary";
import CheckOutPaymentOrder from "./CheckOutPaymentOrder";
import BillingSection from "../ViewCart/BillingSection/BillingSection";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAddress, getAllCartItems } from "../CrudOperations/GetOperation";
import { importCartItems } from "../ReduxStore/Slices/cartSlice";
import UiMobileHeader from "../Header&SideBar/MobileHeader/UiMobileHeader";
import useWindowSize from "../useWindowSize";

const CheckOut = () => {
  const { width } = useWindowSize(); // Get the screen width

  const [isLoginChanged, setIsLoginChanged] = useState(false);
  const [selectAddreess, setselectAddreess] = useState(false);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isPaymentChanged, setIsPaymentChanged] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [AddresssList, setAddresssList] = useState([]);
  const [handleAddressPopup, setHandleAddressPopUp] = useState(false);

  


  const name = "John Doe";
  const phones = "1234567890";

  const addresses = [
    "123 Main St, Anytown, USA",
    "456 Maple Ave, Anytown, USA",
    "789 Oak Dr, Anytown, USA",
  ];

    useEffect(() => {
      const fetchCartItems = async () => {
        const address_response = await getAllAddress();
        console.log(address_response);
  
        if (address_response) {
          setAddresssList(address_response.data.addresses);
        } else {
          navigate("/profile/addresses");
        }




    










  
      };
  
      fetchCartItems();
    }, [dispatch]);

  const handleLoginChange = () => setIsLoginChanged(!isLoginChanged);
  const handleAddressChange = (event) => setSelectedAddress(event.target.value);
  const handleOrderChange = () => setIsOrderChanged(!isOrderChanged);
  const handlePaymentChange = () => setIsPaymentChanged(!isPaymentChanged);
  const handleAddresssModal = () => setHandleAddressPopUp(!handleAddressPopup);


      const OnUpdatePrimaryAddInCheckOut = async () => {
        const address_response = await getAllAddress();
        console.log(address_response);
    
        if (address_response) {
          setAddresssList(address_response.data.addresses);
        } else {
          navigate("/profile/addresses");
        }
      };

  return (
    <div className="w-full mt-20">


    {/* {width < 1024 ?         < UiMobileHeader/> :    <nav className="bg-green-600 p-3 pl-40 w-full">
        <h1 onClick={()=> navigate("/")} className="font-roboto cursor-pointer font-semibold text-2xl text-white">
          Grocery
        </h1>
      </nav>} */}

      <div className="flex   justify-center mt-20 xl:mt-5  ">
        <div className="flex flex-col xl:flex-row justify-center border w-full mx-20 gap-3  ">

          <div className=" rounded w-screen xl:w-full">
            <CheckOutLogin
              isLoginChanged={isLoginChanged}
              name={name}
              phones={phones}
              handleLoginChange={handleLoginChange}
            />

            <CheckOutDeliveryAddress
              selectAddreess={selectAddreess}
              addresses={AddresssList}
              handleAddressChange={handleAddressChange}
              selectedAddress={selectedAddress}
              OnUpdatePrimaryAddInCheckOut={OnUpdatePrimaryAddInCheckOut}
              isPaymentChanged={handlePaymentChange}
              isAddModalopen={handleAddresssModal}
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

          <div className="w-full xl:w-2/6 ">
          {/* Billing Section */}
          {reduxcartItems.data && (
            <BillingSection billDetails={reduxcartItems.bill} />
          )}
          </div>


        </div>

      </div>



      
    </div>
  );
};

export default CheckOut;
