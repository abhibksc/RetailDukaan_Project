import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activePages, logout } from "../ReduxStore/Slices/auth";
import { FaRegUserCircle, FaHeart, FaSearch } from "react-icons/fa";
import { BiLogInCircle } from "react-icons/bi";
import { MdCardGiftcard, MdKeyboardArrowDown } from "react-icons/md";
import { IoIosMenu, IoMdLogOut } from "react-icons/io";
import { MdOutlineBorderStyle } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const ViewCartHeader = () => {
  const loginActive = useSelector((state) => state.auth.loginPageActive);
  const signupPageActive = useSelector((state) => state.auth.signupPageActive);
  const mobilebarToggle = useSelector((state) => state.toggle.mobileMenuToggle);
  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const register = useSelector((state) => state.auth.registered);
  const alldata = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

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
    <header className="fixed mb-10 md:flex px-28 z-20  bg-green-500 text-white   w-full shadow-sm shadow-green-100 ">

      <div className="md:container mx-auto flex  w-40  items-center  ">
        <div className="flex w-40 justify-between">
          <IoIosMenu
            className="w-6 h-6 md:hidden "
            onClick={() => navigate("/")}
          />

          <Link to="/" className="md:text-2xl font-bold">
            Grocery App
          </Link>
        </div>

        <div className="ml-10 hidden md:flex items-center relative">
          <input
            type="text"
            id="search"
            placeholder="Search"
            className="rounded-lg w-96 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-4 text-gray-500" />
        </div>
      </div>

      <nav className="hidden md:block">
        <ul className="hover:text-blue-500 flex gap-1 ">
          <li className="relative z-20 group mt-1 py-4 ">
            <h1 className="hover:text-blue-700 cursor-pointer w-32">
            {(email && !name && email) ||
                  (name && !email && name) ||
                  (!name && !email && "Login") ||
                  (name && email && name)}
            </h1>
            <div className="absolute px-3 left-0 hidden  bg-gray-100 shadow-lg  mt-4 w-56 py-4 group-hover:block z-10">
              <ul className="text-black flex flex-col gap-4   cursor-pointer ">
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
                <li className="group hover:text-blue-500 border-b-2 py-2">
                  <div
                    className="flex gap-2"
                    onClick={() => navigate("/profile")}
                  >
                    <FaRegUserCircle className="mt-1" />
                    <span>My Profile</span>
                  </div>
                </li>
                <li className="group hover:text-blue-500 border-b-2 py-2">
                  <div
                    className="flex gap-2"
                    onClick={() => navigate("/profile/orders")}
                  >
                    <MdOutlineBorderStyle className="mt-1" />
                    <span>Order</span>
                  </div>
                </li>
                <li className="group hover:text-blue-500 border-b-2 py-2">
                  <div className="flex gap-2">
                    <FaHeart className="mt-1" />
                    <span>Wishlist</span>
                  </div>
                </li>
                <li className="group hover:text-blue-500 border-b-2 py-2">
                  <div className="flex gap-2">
                    <MdCardGiftcard className="mt-1" />
                    <span>Gift Card</span>
                  </div>
                </li>
                {register && (
                  <li className="group hover:text-blue-500 ">
                    <div className="flex gap-2">
                      <IoMdLogOut className="mt-1" />
                      <span
                        onClick={() => {
                          localStorage.removeItem("state");
                          dispatch(logout());

                          dispatch(
                            activePages({
                              login: true,
                              signup: false,
                            })
                          );
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
          <MdKeyboardArrowDown className="mt-6" />
        </ul>
      </nav>
    </header>
  );
};

export default ViewCartHeader;
