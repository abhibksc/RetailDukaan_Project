import { useState } from "react";
import { RiExportFill } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { MdPayment } from "react-icons/md";
import { TbUserScreen } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { activePages, logout } from "../ReduxStore/Slices/auth";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const username = useSelector((state)=>state.auth.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div
    className="w-72 hidden lg:flex flex-col gap-3 bg-white  ">
      {/* Profile Section */}
      <div className="border p-3   flex gap-2 items-center ">
        <img
          className="w-10 ml-4 rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1imiVM8S3xrhemabq6IZYCUfJTLWABjE_1Q&s"
          alt="Profile"
        />
        <div className="ml-3 flex flex-col">
          <span className="font-medium">Hello,</span>
          <span className="font-bold">{username}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="border p-3 flex flex-col gap-6 bg-white">
        {/* My Orders */}
        <Link
          to="/order"
          className={`flex items-center gap-6 border-b p-5 cursor-pointer hover:text-blue-500 ${
            activeItem === "/orders" ? "bg-blue-200" : ""
          }`}
          onClick={() => handleItemClick("/orders")}
        >
          <RiExportFill className="text-xl size-7" />
          <span className="font-medium">MY ORDERS</span>
        </Link>

        {/* Account Settings */}
        <div className="flex items-center gap-4 border-b p-5">
          <FaRegUserCircle className="text-xl mb-24 size-7" />
          <div className="flex flex-col">
            <h1 className="font-bold text-gray-500">ACCOUNT SETTING</h1>
            <div className="mt-3 flex flex-col gap-4">
              <Link
                to="/profile"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile" ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => handleItemClick("/profile")}
              >
                Profile Information
              </Link>
              <Link
                to="/profile/addresses"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/addresses"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/addresses")}
              >
                Manage Addresses
              </Link>
              <Link
                to="/profile/pancard"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/pancard"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/pancard")}
              >
                Pan Card Information
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="flex items-center gap-3 border-b p-5">
          <MdPayment className="text-xl mb-24 size-7" />
          <div className="flex flex-col">
            <h1 className="font-bold text-gray-500">PAYMENTS</h1>
            <div className="mt-3 flex flex-col gap-4">
              <Link
                to="/profile/giftcards"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/giftcards"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/giftcards")}
              >
                Gift Cards
              </Link>
              <Link
                to="/profile/savedupi"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/savedupi"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/savedupi")}
              >
                Saved UPI
              </Link>
              <Link
                to="/profile/savedcard"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/savedcard"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/savedcard")}
              >
                Saved Cards
              </Link>
            </div>
          </div>
        </div>

        {/* My Stuff */}


   

        <div className="flex items-center gap-3 border-b p-5">
          <TbUserScreen className="text-xl mb-36 size-7" />
          <div className="flex flex-col">
            <h1 className="font-bold text-gray-500">MY STUFF</h1>
            <div className="mt-3 flex flex-col gap-4">


            {/* <Link
                to="/profile/StoreOffer"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/StoreOffer"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/StoreOffer")}
              >
               Store Offer
              </Link> */}

     {/* <Link
                to="/profile/referral"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/referral"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/referral")}
              >
                My Refferals
              </Link> */}


              <Link
                to="/profile/mycoupon"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/mycoupon"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/mycoupon")}
              >
                My Coupons
              </Link>
              <Link
                to="/profile/myreviews&ratings"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/myreviews&ratings"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/myreviews&ratings")}
              >
                My Reviews & Ratings
              </Link>
              <Link
                to="/profile/allnotifications"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/allnotifications"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/allnotifications")}
              >
                All Notifications
              </Link>
              <Link
                to="/profile/mywishlist"
                className={`text-sm font-semibold cursor-pointer hover:text-blue-500 ${
                  activeItem === "/profile/mywishlist"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => handleItemClick("/profile/mywishlist")}
              >
                My Wishlist
              </Link>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div
          className={`flex items-center gap-7 cursor-pointer hover:text-blue-500 ${
            activeItem === "logout" ? "text-blue-600 font-semibold" : ""
          }`}
          onClick={()=>{
            localStorage.removeItem("state");
            dispatch(activePages({ login: true}));
            dispatch(logout());
            navigate("/")
          }}
        >
          <IoMdLogOut className="text-xl ml-4 size-7" />
          <span className="font-medium">LOGOUT</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
