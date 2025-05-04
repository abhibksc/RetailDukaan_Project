import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/animations/shopCart.json";
import animationDataa from "../../assets/animations/Emptylist.json";
import PriceDetails from "./MobileViewCart/Checkout/PriceDetails";
import {
  addCart,
  decreaseCart,
  importCartItems,
} from "../ReduxStore/Slices/cartSlice";
import { getAllAddress, getAllCartItems } from "../CrudOperations/GetOperation";
import { useDispatch, useSelector } from "react-redux";
import BillingSection from "./BillingSection";
import { useNavigate } from "react-router-dom";
import AddressPopUp from "./AddressPopUp";
import LoadingModal from "../LoadingModal";
import {
  DecreaseItemQuantityToCart,
  IncreaseItemQuantityToCart,
} from "../CrudOperations/PostOperation";
import { toast } from "react-toastify";
import { log } from "tone/build/esm/core/util/Debug";
import useCartActions from "../Product/useCartActions";
import useTruncateSentance from "../UseFullHooks/useTruncateSentance";
import { FaIndianRupeeSign } from "react-icons/fa6";
// import AddressPopUp from "./AddressPopUp";

const CartDashboard = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationDataa,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const dispatch = useDispatch();
  const [primary, setPrimary] = useState("");
  const [AddresssList, setAddresssList] = useState([]);
  const navigate = useNavigate();
  const { truncateText} = useTruncateSentance();
  const [loading, setLoading] = useState(false);

  const [addressPopUp, setAddressPopUp] = useState(false);



  const [totals, setTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    total: 0,
  });


  const { addItemToCart, increaseQuantity, decreaseQuantity } = useCartActions();

  const isInCart = (itemId) => {
 

    if (reduxcartItems && reduxcartItems.data.length > 0) {
    

      const answer = reduxcartItems.data.find(
        (ele) => ele.variant_sku_id == itemId
      );

  

      return answer ? true : false;
    }

  };

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

  useEffect(() => {
    if (AddresssList) {
      const primary_add = AddresssList.find((ele) => ele.primary_address == 1);
      setPrimary(primary_add);
    }
  }, [AddresssList]);




  const handleAddresspopUp = () => {
    setAddressPopUp(!addressPopUp);
  };

  const OnUpdatePrimaryAdd = async () => {
    setLoading(true);
    const address_response = await getAllAddress();
    if (address_response) {
      const response = await getAllCartItems();
      setAddresssList(address_response.data.addresses);
    } else {
      navigate("/profile/addresses");
    }

    setLoading(false);
  };


  const getQuantityByVariantId = (variantId) => {
    const item = reduxcartItems.data.find(
      (item) => item.variant_sku_id == variantId
    );

    return item ? item.quantity : 0; // Return quantity or default to 0
  };

  return (
    <div className="  p-6 ">
      <div className="flex gap-6 flex-col xl:flex-row ">
        {loading && <LoadingModal />}
        {/* Grocery Part */}
        <div
          className={`${
            reduxcartItems.data &&
            reduxcartItems.data.length > 0 &&
            "w-full border p-4 bg-white rounded-md shadow-md"
          }   border mx-auto w-3/4 p-4 bg-white rounded-md shadow-md`}
        >
          {/* Location Details */}
          {reduxcartItems && reduxcartItems.data.length > 0 && primary && (
            <div className="flex flex-col xl:flex-row justify-between mb-4 border p-4">
              <div className="">
                <div className="flex gap-4 text-gray-700">
                  <span>Deliver to:</span>
                  <span className="font-bold text-[15px]    text-black ">{`${truncateText(primary.name, 1)}, ${primary.pin_code}`}</span>
                  <span className="border hidden xl:block bg-gray-200 font-inter text-sm px-2 rounded-md">
                    {primary.address_type}
                  </span>
                </div>
                <div>{primary.full_addresss}</div>
              </div>
              

              <div>
                <button
                  className="text-blue-500 border p-2 rounded-md hover:bg-blue-600 hover:text-white shadow-md"
                  onClick={() => handleAddresspopUp()}
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* <h1 className="text-center font-bold font-inter text-green-500 mb-3">       Grocery Items</h1> */}
          <ul className="space-y-4">
            {reduxcartItems.data ? (
              reduxcartItems.data.map((item) => {

                const discountedPrice = (
                  item.mrp -
                  (item.mrp * item.discount_percentage_in_mrp) /
                    100
                ).toFixed(2);


                return (    <li
                  key={item.grocery_cart_Item_id}
                  className="p-4 border flex flex-col xl:flex-row justify-between items-center bg-gray-50 rounded-md"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image_url}
                      alt={item.variant_Name}
                      className=" w-20 h-20 md:w-12 md:h-12 lg:w-14 lg:h-14          xl:w-16 xl:h-16  object-cover rounded-md"
                    />
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold text-gray-800">
                      {truncateText(item.variant_Name, 4)}                    
                      </div>

                                {/* Product Details */}
                                           <h2 className="text-[14px] mt-2 line-clamp-2">
                                             {item.brand} {item.variantName}
                                           </h2>
                     
                                           {/* Price Details in Single Line */}
                                           <div className="flex items-center text-sm mt-1">
                                             <div className="text-gray-800 font-semibold flex items-center">
                                               <FaIndianRupeeSign />
                                               {discountedPrice}
                                             </div>
                                            {item.discount_percentage_in_mrp > 0 && <div className="line-through text-gray-500 ml-2">
                                               ₹{item.mrp}
                                             </div>}
                                            {item.discount_percentage_in_mrp > 0 && <div className="text-green-600 ml-2">
                                               { Math.round(item.discount_percentage_in_mrp)}% Off
                                             </div>}
                                           </div>






                    </div>
                  </div>

               <div className="ml-14">
               {isInCart(item.variant_sku_id) ? (
                  <div className="flex items-center justify-between border border-gray-400 bg-white shadow-lg rounded-md ml-2 mx-4 px-4 py-2 hover:shadow-xl transition-shadow duration-300">
                  <button
                    className="px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-100 rounded-l-md hover:bg-gray-200 hover:text-gray-900 focus:ring-2 focus:ring-gray-400"
                    onClick={() =>
                      decreaseQuantity(item.variant_sku_id, item.purchase_item_id, item.Varient_type)
                    }
                  >
                    -
                  </button>
                  <span className="px-4 text-base font-medium text-gray-800">
                    {getQuantityByVariantId(item.variant_sku_id)}
                  </span>
                  <button
                    className="px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-100 rounded-r-md hover:bg-gray-200 hover:text-gray-900 focus:ring-2 focus:ring-gray-400"
                    onClick={ () =>
                      increaseQuantity(item.variant_sku_id, item.purchase_item_id, item.Varient_type)
                    }
                  >
                    +
                  </button>
                </div>
                
                  ) : (
                    <button
                      className="flex-1 bg-blue-500 text-white text-xs rounded p-1 py-2 ml-2 hover:bg-blue-600"
                      onClick={() => addItemToCart(item.variant_sku_id)}
                    >
                      Add to Cart
                    </button>
                  )}
               </div>

                </li>)
              }
            
            
            
            )
            ) : (
              <div className=" p-4  bg-white rounded-md shadow-md">
                {/* Placeholder for price details */}
                <Lottie options={defaultOptions2} height={300} width={380} />
                <div className="text-center mt-2">
                  <h1 className="font-semibold">Your Basket Is Empty</h1>
                  <p>Enjoy Upto 50% Savings on Grocery Shop now</p>

                  <button className="text-center flex-1 bg-blue-500 text-white text-sm rounded px-8 py-2 mt-3  hover:bg-blue-600">
                    Shop Now
                  </button>
                </div>
              </div>
            )}
          </ul>
        </div>

        {reduxcartItems.data && reduxcartItems.data.length > 0 && (
          <div className="flex flex-col  gap-2">
            {/* animation */}
            <div className=" p-4 w-[400px] hidden xl:block bg-white rounded-md shadow-md">
              {/* Placeholder for price details */}
              <Lottie options={defaultOptions} height={200} width={380} />
            </div>

            <div>
              {/* Billing Section */}
                <BillingSection  />

              <div className="w-full  text-white bg-green-400 text-center mt-2 shadow-sm py-2 rounded-md">
                <button onClick={() => navigate("/CheckOut")}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {addressPopUp && (
          <AddressPopUp
            Addresss={AddresssList}
            onclose={handleAddresspopUp}
            OnUpdatePrimaryAdd={OnUpdatePrimaryAdd}
          />
        )}
      </div>
    </div>
  );
};

export default CartDashboard;
