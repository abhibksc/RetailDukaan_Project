import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { activeMobileLoginPages, logout } from "../ReduxStore/Slices/auth";
import { MdCardGiftcard, MdOutlineBorderStyle, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BiLogInCircle, BiNotification } from "react-icons/bi";
import { FaHeart, FaMapMarkerAlt, FaRegUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import BackButton from "../BackButton";
import useTruncateSentance from "../UseFullHooks/useTruncateSentance";

const MobileSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {truncateText} = useTruncateSentance();

  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const phone = useSelector((state) => state.auth.phone);
  const register = useSelector((state) => state.auth.registered);

  const handleLogin = () => {
    dispatch(activeMobileLoginPages({ login: true }));
  };

  return (

    <div className="mb-14 flex h-[calc(100vh-66px)] overflow-y-auto">




        <div className="w-full pt-16  min-h-screen  bg-white shadow-md rounded-lg text-gray-900">


{/* Navigation Links */}
<ul className="mt-4 p-4 space-y-3">
  {!register && (
    <li onClick={handleLogin} className="flex items-center gap-2 p-4 border-b-2 text-blue-600 cursor-pointer">
      <BiLogInCircle /> Login
    </li>
  )}
  <li onClick={() => (register ? navigate("/Profile/personal-Information") : handleLogin())} className="p-4 border-b-2 flex items-center gap-2 cursor-pointer">
    <FaRegUserCircle /> My Profile
  </li>
  <li 
  onClick={() => (register ? navigate("/Profile/addresses") : handleLogin())} 
  className="p-4 border-b-2 flex items-center gap-2 cursor-pointer"
>
  <FaMapMarkerAlt /> Manage Address
</li>
  <li onClick={() => (register ? navigate("/order") : handleLogin())} className="p-4 border-b-2 flex items-center gap-2 cursor-pointer">
    <MdOutlineBorderStyle /> Orders
  </li>
  <li onClick={() => (register ? navigate("/Profile/mywishlist") : handleLogin())} className="p-4 border-b-2 flex items-center gap-2 cursor-pointer">
    <FaHeart /> Wishlist
  </li>
  <li onClick={() => (register ? navigate("/Profile/giftcards") : handleLogin())} className="p-4 border-b-2 flex items-center gap-2 cursor-pointer">
    <MdCardGiftcard /> Gift Card
  </li>
  <li onClick={() => (register ? navigate("/Profile/allnotifications") : handleLogin())} className="p-4 border-b-2 flex items-center gap-2 cursor-pointer">
    <BiNotification /> Notifications
  </li>
  {register && (
    <li
      onClick={() => {
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
      }}
      className="flex p-4 border-b-2 items-center gap-2 text-red-600 cursor-pointer"
    >
      <IoMdLogOut /> Logout
    </li>
  )}
</ul>
</div>


    </div>

  

  );
};

export default MobileSideBar;