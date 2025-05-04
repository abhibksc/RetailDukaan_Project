import React, { useEffect, useState } from "react";
import { RiExportFill, RiUser6Line, RiHeartLine, RiGiftLine, RiNotificationLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineKeyboardArrowDown, MdPayment } from "react-icons/md";
import { TbUserScreen } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mobilemenu } from "../ReduxStore/Slices/toggleSlice";
import { activePages, logout } from "../ReduxStore/Slices/auth";

const MobileSideBar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const mobilebarToggle = useSelector((state) => state.toggle.mobileMenuToggle);
  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const register = useSelector((state) => state.auth.registered);

  const dispatch = useDispatch();

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  useEffect(() => {
    if (mobilebarToggle) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [mobilebarToggle]);

  return (
    <div
      className={`fixed z-10 top-14 left-0 h-screen w-full bg-white overflow-y-hidden transform transition-transform duration-300 ease-in-out ${
        mobilebarToggle ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="border p-3 flex flex-col gap-6 bg-white">

        <Link
          to={(!name && !email) ? "/" : "/profile" }
          className={`flex items-center gap-6 border-b p-3 cursor-pointer`}
          onClick={() => {
            handleItemClick("/profile/orders");
            dispatch(Mobilemenu({ mobileMenuToggle: false }));
            if (!name && !email) {
              dispatch(activePages({ login: true }));
            }
          }}
        >
          <RiUser6Line className="w-8 h-8" />
          <span className="font-bold font-inter text-2xl">
            {(email && !name && email) ||
              (name && !email && name) ||
              (!name && !email && "Login") ||
              (name && email && name)}
          </span>
        </Link>

        <Link
          to="/profile/orders"
          className={`flex items-center gap-6 border-b p-3 cursor-pointer hover:text-blue-500`}
          onClick={() => {
            handleItemClick("/profile/orders");
            dispatch(Mobilemenu({ mobileMenuToggle: false }));
          }}
        >
          <RiExportFill className="text-xl" />
          <span className="font-medium">MY ORDERS</span>
        </Link>

        <Link
          to="/profile"
          className={`flex items-center gap-6 border-b p-3 cursor-pointer`}
          onClick={() => {
            dispatch(Mobilemenu({ mobileMenuToggle: false }));
          }}
        >
          <FaRegUserCircle className="text-xl" />
          <span className="font-medium">My Profile</span>
        </Link>

        <Link
          to="/profile/mywishlist"
          className={`flex items-center gap-6 border-b p-3 cursor-pointer`}
          onClick={() => {
            handleItemClick("/profile/mobileCategoryHeader");
            dispatch(Mobilemenu({ mobileMenuToggle: false }));
          }}
        >
          <RiHeartLine className="text-xl" />
          <span className="font-medium">Wishlist</span>
        </Link>

        <Link
          to="/profile/giftcards"
          className={`flex items-center gap-6 border-b p-3 cursor-pointer`}
          onClick={() => {
            handleItemClick("/profile/mobileCategoryHeader");
            dispatch(Mobilemenu({ mobileMenuToggle: false }));
          }}
        >
          <RiGiftLine className="text-xl" />
          <span className="font-medium">Gift Card</span>
        </Link>

        <Link
          to="/profile/allnotifications"
          className={`flex items-center gap-6 border-b p-3 cursor-pointer`}
          onClick={() => {
            handleItemClick("/profile/mobileCategoryHeader");
            dispatch(Mobilemenu({ mobileMenuToggle: false }));
          }}
        >
          <RiNotificationLine className="text-xl" />
          <span className="font-medium">Notification</span>
        </Link>

        {register && (
          <Link
            to="/"
            className={`flex items-center gap-6 border-b p-3 cursor-pointer`}
            onClick={() => {
              localStorage.removeItem("state");
              dispatch(Mobilemenu({ mobileMenuToggle: false }));
              dispatch(activePages({ login: true }));
              dispatch(logout());
              navigate("/");
            }}
          >
            <IoMdLogOut className="text-xl" />
            <span className="font-medium">Logout</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileSideBar;
