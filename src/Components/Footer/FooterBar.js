import React from "react";
import { ShoppingCartIcon, ViewListIcon, StarIcon, ShoppingBagIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { activeMobileLoginPages } from "../ReduxStore/Slices/auth";

const FooterBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // setLoading

  const register = useSelector((state) => state.auth.registered);
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

  return (
    <footer className="fixed bottom-0  left-0 right-0 bg-gradient-to-b from-yellow-500 to-white text-gray-900 py-3 shadow-lg">
      <div className="flex justify-around items-center">
        {/* Grocery */}
        <div className="flex flex-col items-center" onClick={() => navigate("/")}>
          <ShoppingBagIcon className="h-6 w-6 black-gray-300 " />
          <span className="text-sm mt-1">Grocery</span>
        </div>

        {/* Categories */}
        <div className="flex flex-col items-center" onClick={() => navigate("/Categoy") }>
          <ViewListIcon className="h-6 w-6 black-gray-300" />
          <span className="text-sm mt-1">Categories</span>
        </div>

        {/* Top Picks */}
        <div className="flex flex-col items-center">
          <StarIcon className="h-6 w-6 black-gray-300" />
          <span className="text-sm mt-1">Top Picks</span>
        </div>

        {/* Cart */}
        <div className="flex flex-col items-center" onClick={() => register ? navigate("/viewCart") : dispatch(activeMobileLoginPages({ login: true }))}>
          <ShoppingCartIcon className="h-6 w-6 black-gray-300" />
          <span className="text-sm mt-1">Cart</span>
          {reduxcartItems.data.length > 0 && (
                  <span className="absolute top-0 right-7 bg-red-500   text-white text-sm rounded-full px-1 ">
                    {reduxcartItems.data.length}
                  </span>
                )}
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;
