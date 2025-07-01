import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";



import {
  activePages,
} from "../../ReduxStore/Slices/auth";
import { MdOutlineShoppingCart } from "react-icons/md";

const NavCart = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // setLoading

  const register = useSelector((state) => state.auth.registered);
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  console.log(reduxcartItems?.data?.length + reduxcartItems?.SingUp_Offer?.length); // it prints 3 but not rendering.. 3
  


 



  

  return (
<li
  className="flex text-[12px] gap-1 items-center cursor-pointer relative py-1"
  onClick={() => register ? navigate("/viewCart") : dispatch(activePages({ login: true }))}>
  <MdOutlineShoppingCart className="w-6 h-6 mt-1" />
  <span className="mt-1">Cart</span>
  
  {(reduxcartItems?.data?.length > 0 || reduxcartItems?.SingUp_Offer?.length > 0) && (
    <span className="absolute top-1 right-10 bg-red-500 text-white text-sm rounded-full px-1">
      {reduxcartItems?.data?.length + reduxcartItems?.SingUp_Offer?.length}
    </span>
  )}
</li>

  );
};

export default NavCart;