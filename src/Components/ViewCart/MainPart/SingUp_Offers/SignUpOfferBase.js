import Lottie from "react-lottie";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import useTruncateSentance from "../../../UseFullHooks/useTruncateSentance";
import animationDataa from "../../../../assets/animations/Emptylist.json";
import baseurl from "../../../CrudOperations/customURl";
import { SingUpOffer_idCancellation_from_Cart } from "../../../CrudOperations/DeleteOperation";
import { importCartItems } from "../../../ReduxStore/Slices/cartSlice";
import { toast } from "react-toastify";




const SignUpOfferBase = () => {
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationDataa,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const dispatch = useDispatch();


    const Latitude = useSelector((state) => state.auth.Location.Latitude);
    const Longitude = useSelector((state) => state.auth.Location.Longitude);
      const AreaPin = useSelector((state) => state.auth.AreaPin);

  const Cart_SingUp_Offer = useSelector((state) => state?.cartReducer?.cartItems?.SingUp_Offer);
     (Cart_SingUp_Offer);
  
  const { truncateText } = useTruncateSentance();


const handleCancel_Paticular_signUp_offer = async(cartItem_id, singUpOffer_id)=>{

     (cartItem_id);
     (singUpOffer_id);
  


  const response = await SingUpOffer_idCancellation_from_Cart(
    cartItem_id,
    singUpOffer_id,
    Latitude,
    Longitude,
    AreaPin
  );
     (response);

  if(response?.data?.message === "Offer item cancelled and cart updated successfully." || response?.data?.message === "Offer item cancelled. No items left in the cart."){

    dispatch(importCartItems(response?.data?.groceryItems));

          toast.success("Item added to cart successfully.");


  }
  else{

toast.error(response?.data?.message)

  }
  
  
}

return (
  <div className=" bg-white mx-auto px-4 py-6 mb-5">
    <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-6">
      🎉 Exclusive Signup Offer
    </h1>

    {Cart_SingUp_Offer?.length > 0 ? (
      <ul className="grid grid-cols-1 gap-6">
        {Cart_SingUp_Offer.map((item) => {
          const discountedPrice = (
            item.offer_mrp -
            (item.offer_mrp * item.offer_discount) / 100
          ).toFixed(2);

          return (
            <li
              key={item.GroceryCart_Item_Id}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-all flex flex-col xl:flex-row items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`${baseurl}/images/${item.offer_image_path}`}
                  alt={item.offer_name}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div className="space-y-1">
                  <p className="text-lg font-medium text-gray-800">
                    {truncateText(item.offer_name, 4)}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-800 font-semibold flex items-center">
                      <FaIndianRupeeSign className="mr-1" />
                      {discountedPrice}
                    </span>
                    {item.offer_discount > 0 && (
                      <>
                        <span className="line-through text-gray-400 ml-2">
                          ₹{item.offer_mrp}
                        </span>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs font-semibold rounded">
                          {Math.round(item.offer_discount)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button className="mt-4 xl:mt-0 text-red-500 hover:text-red-600 font-bold text-xl" onClick={()=>handleCancel_Paticular_signUp_offer(item.GroceryCart_Item_Id, item.id )}>
                ×
              </button>
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center max-w-md mx-auto">
        <Lottie options={defaultOptions2} height={250} width={300} />
        <h2 className="text-xl font-bold mt-4 text-gray-800">Your Basket Is Empty</h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Enjoy up to <span className="text-green-600 font-semibold">50% savings</span> on grocery items!
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md mt-4 text-sm font-medium transition">
          Shop Now
        </button>
      </div>
    )}
  </div>
);




};

export default SignUpOfferBase;
