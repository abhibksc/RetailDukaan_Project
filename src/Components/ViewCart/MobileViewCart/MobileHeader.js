import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { activePages, logout } from "../ReduxStore/Slices/auth";
import { FaRegUserCircle, FaHeart, FaSearch } from "react-icons/fa";
import { BiLogInCircle } from "react-icons/bi";
import { MdCardGiftcard, MdKeyboardArrowDown } from "react-icons/md";
import { IoIosArrowRoundBack, IoIosMenu, IoMdLogOut } from "react-icons/io";
import { MdOutlineBorderStyle } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import BackButton from "../../BackButton";

const MobileHeader = () => {
  const loginActive = useSelector((state) => state.auth.loginPageActive);
  const signupPageActive = useSelector((state) => state.auth.signupPageActive);
  const mobilebarToggle = useSelector((state) => state.toggle.mobileMenuToggle);
  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const register = useSelector((state) => state.auth.registered);
  const alldata = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  console.log(alldata);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginActive && !signupPageActive) {
      dispatch(activePages({ login: true, signup: false }));
    }
  };

  // Replace with actual user data
  const userName = "Admin User";
  const adminLogo = "https://via.placeholder.com/150"; // Replace with actual logo URL

  // List of sidebar links
  //   const sidebarLinks = [{ to: "/admin/dashboard", label: "Dashboard" }];

  return (
    <header className="fixed md:hidden p-3 z-20 bg-green-500 text-white   w-full shadow-sm shadow-green-100 ">

    <div className=" flex   ">


      <div className="flex mx-4 justify-between w-full sm:ml-0 xl:ml-0 md:ml-0 lg:ml-0">
        <div className="flex   gap-4 justify-between">
        {/* <IoIosArrowRoundBack className=" w-7 h-7 self-center"/> */}
        <BackButton className=" w-10 text-white h-10 self-center" />

          <Link to="/" className="text-[16px] mt-2 font-bold">
            Grocery Basket (3 items)
          </Link>
        </div>

        {/* <div className="ml-10  md:flex items-center relative">
          
          <FaSearch className="absolute right-4 self-center text-white" />
        </div> */}
      </div>

    

      
    </div>

  </header>
  );
};

export default MobileHeader;
