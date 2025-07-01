import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { FaRegUserCircle, FaHeart, FaSearch } from "react-icons/fa";
import { BiLogInCircle, BiNotification } from "react-icons/bi";
import { MdCardGiftcard } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineBorderStyle } from "react-icons/md";
import { MdOutlineBorderStyle } from "react-icons/md";
import {
  activePages,
  logout,
} from "../../ReduxStore/Slices/auth";

const NavLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const phone = useSelector((state) => state.auth.phone);

  const register = useSelector((state) => state.auth.registered);

//   const getUsernameFromEmail = (email) => {
//     if (email) {
//       return email.split("@")[0];
//     }
//     return "";
//   };

//   const ExtractedMail = getUsernameFromEmail(email);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(activePages({ login: true }));
  };


  return (
    <li className="relative text-[12px]  group mt-1  py-4 hidden xl:block">
      <div
        className="flex gap-1  hover:text-blue-700 cursor-pointer py-1"
        onClick={() => !email && !name && handleLogin}
      >
        <h1>

            {(email && !name && email) ||
            (name && !email && name) ||
            (!phone &&  !name && !email && "Login") ||
            (!name && !email &&  phone && "LoggedIn") ||
            (name && email && name)} 



        </h1>

        <MdOutlineKeyboardArrowDown className="mt-1" />
      </div>

      <div className="absolute px-3 left-0 hidden  bg-gray-100 shadow-lg  mt-4 w-56 py-4 group-hover:block z-10">
        <ul className="text-black flex flex-col gap-4 cursor-pointer">
          {!register && (
            <li
              className="group hover:text-blue-500 border-b-2 py-2 "
              onClick={handleLogin}
            >
              <div className="flex gap-2">
                <BiLogInCircle className="mt-1" />
                <span>Login</span>
              </div>
            </li>
          )}
          {
            <div>
              <li className="group hover:text-blue-500 border-b-2 py-2">
                <div
                  className="flex gap-2"
                  onClick={() => { register ?  navigate("/profile") : dispatch(activePages({ login: true }));}}
                >
                  <FaRegUserCircle className="mt-1" />
                  <span>My Profile</span>
                </div>
              </li>
              <li className="group hover:text-blue-500 border-b-2 py-2">


                <div className="flex gap-2" onClick={() => register ? navigate("/order") : dispatch(activePages({ login: true }))}>
                  <MdOutlineBorderStyle className="mt-1" />
                  <span>Order</span>


                </div>
              </li>
              <li className="group hover:text-blue-500 border-b-2 py-2">
                <div
                  className="flex gap-2"
                  onClick={() => register ? navigate("/profile/mywishlist") : dispatch(activePages({ login: true }))}
                >
                  <FaHeart className="mt-1" />
                  <span>Wishlist</span>
                </div>
              </li>
              <li className="group hover:text-blue-500 border-b-2 py-2">
                <div
                  className="flex gap-2 "
                  onClick={() => register ? navigate("/profile/giftcards") : dispatch(activePages({ login: true }))}
                >
                  <MdCardGiftcard className="mt-1" />
                  <span>Gift Card</span>
                </div>
              </li>

              <li
                onClick={() => register ? navigate("/profile/allnotifications") : dispatch(activePages({ login: true }))}
                className="group hover:text-blue-500 border-b-2 py-2"
              >
                <div className="flex gap-2">
                  <BiNotification className="mt-1" />
                  <span>Notification</span>
                </div>
              </li>
            </div>
          }
          {register && (
            <li className="group hover:text-blue-500 ">
              <div className="flex gap-2">
                <IoMdLogOut className="mt-1" />
                <span
                  onClick={() => {
                    localStorage.removeItem("token");
                    dispatch(activePages({ login: true }));
                    dispatch(logout());
                    navigate("/");
                  }}
                >
                  Logout
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </li>
  );
};

export default NavLogin;
