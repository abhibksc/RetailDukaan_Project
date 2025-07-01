import {  useSelector } from "react-redux";
import LoactionDetails from "./LoactionDetails";
import Cart_Item_Section from "./Cart_Item_Section";
import SignUpOfferBase from "./SingUp_Offers/SignUpOfferBase";
import Lottie from "react-lottie";
import animationDataa from "../../../assets/animations/Emptylist.json";
import { useNavigate } from "react-router-dom";

const MainPartBase = () => {
 const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

      const navigate = useNavigate();

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationDataa,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };




  return (
        <div
          className={'w-full'}
        >

   {reduxcartItems.bill && <LoactionDetails/>}
   {reduxcartItems?.SingUp_Offer?.length > 0 && <SignUpOfferBase/>}
   {reduxcartItems?.data?.length > 0 && <Cart_Item_Section/>}



   { !reduxcartItems?.bill &&

         <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center max-w-md mx-auto">
        <Lottie options={defaultOptions2} height={250} width={300} />
        <h2 className="text-xl font-bold mt-4 text-gray-800">Your Basket Is Empty</h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Enjoy up to <span className="text-green-600 font-semibold">50% savings</span> on grocery items!
        </p>
        <button onClick={()=>navigate("/")} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md mt-4 text-sm font-medium transition">
          Shop Now
        </button>
      </div>



   }



              
          
        </div>
  );
};

export default MainPartBase;
