import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
// import {
//   activePages,
//   logout,
//   setLat_Long_Location,
//   updateAreaPin,
// } from "../ReduxStore/Slices/auth";

// import Login from "../UserAuth/LoginModal";

import { FaRegUserCircle, FaHeart, FaSearch } from "react-icons/fa";
import { IoIosNotifications, IoIosMenu } from "react-icons/io";
import { BiLogInCircle, BiNotification } from "react-icons/bi";
import { MdCardGiftcard } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineBorderStyle } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineBorderStyle } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import {
  activePages,
  logout,
  setLat_Long_Location,
  updateAreaPin,
} from "../../ReduxStore/Slices/auth";
import { Mobilemenu } from "../../ReduxStore/Slices/toggleSlice";
import logo from "../../../assets/Logo/retail_dukaan_images.png";
import { RiUser6Line } from "react-icons/ri";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // setLoading

  const loginActive = useSelector((state) => state.auth.loginpageActive);
  const signupPageActive = useSelector((state) => state.auth.signupPageActive);
  const mobilebarToggle = useSelector((state) => state.toggle.mobileMenuToggle);
  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const register = useSelector((state) => state.auth.registered);
  const alldata = useSelector((state) => state.auth);
  console.log(alldata);
  const AreaPin = useSelector((state) => state.auth.AreaPin);
  const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);

  console.log(AreaPin);

  const [pincode, setPincode] = useState(AreaPin);
  const [isValid, setIsValid] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState(null);

  const handleChange = (event) => {
    const { value } = event.target;
    setPincode(value);
    if (value.length === 6) {
      verifyPincode(value);
    } else {
      setIsValid(null);
      setPincodeInfo(null);
    }
  };

  console.log(pincodeInfo);

  const verifyPincode = async (pincode) => {
    // Replace with your actual Postman Pincode API endpoint
    const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;
    console.log(apiEndpoint);

    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      if (data[0].Status === "Success") {
        dispatch(updateAreaPin({ pincode: pincode }));
        setIsValid(true);
        setPincodeInfo(data[0].PostOffice);
      } else {
        setIsValid(false);
        setPincodeInfo(null);
      }
    } catch (error) {
      console.error("Error verifying pincode:", error);
      setIsValid(false);
      setPincodeInfo(null);
    }
  };

  // Handle Current location

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  const handleCurrentLocation = () => {
    // Set loading state (optional, if you're using a loading state in the UI)
    // setLoading(true);

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
      setLoading(false); // Stop loading in case of an unsupported browser
      return;
    }

    // Success callback for geolocation
    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      console.log("ahishekkumar");

      dispatch(
        setLat_Long_Location({
          Latitude: latitude,
          Longitude: longitude,
        })
      );
      setLocation({ latitude, longitude });

      fetchAddressFromCoords(latitude, longitude);
    };

    // Error callback for geolocation
    const onError = (error) => {
      const errorMessages = {
        1: "Permission denied. Please enable location services.",
        2: "Position unavailable. Unable to determine your location.",
        3: "Timeout. Location request took too long.",
        default: "An unknown error occurred while fetching location.",
      };

      const message = errorMessages[error.code] || errorMessages.default;
      console.error(message);
      alert(message); // Optional: Inform the user about the error
    };

    // Geolocation options for better accuracy
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // Set timeout to prevent infinite wait
      maximumAge: 0, // Do not use cached position
    };

    // Fetch the current location
    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  };

  // Function to fetch address details from coordinates
  const fetchAddressFromCoords = (latitude, longitude) => {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received from API:", data);

        const address = data.address || {};
        console.log("Address extracted:", address);

        if (address.postcode) {
          dispatch(updateAreaPin({ pincode: address.postcode }));
          setIsValid(true); // Update validity state based on success
        } else {
          console.warn("Postcode not found in address:", address);
          dispatch(updateAreaPin({ pincode: "N/A" })); // Fallback in case no postcode
          setIsValid(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching address details: ", error);
        alert("Unable to fetch location details. Please try again later.");
      })
      .finally(() => {
        setLoading(false); // Stop loading once fetch is complete
      });
  };

  const getUsernameFromEmail = (email) => {
    if (email) {
      return email.split("@")[0];
    }
    return "";
  };

  const ExtractedMail = getUsernameFromEmail(email);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(activePages({ login: true }));
  };

  const handleMenu = () => {
    if (mobilebarToggle === false) {
      dispatch(
        Mobilemenu({
          mobileMenuToggle: true,
        })
      );

      navigate(`/Profile`)
    } else {

      // navigate(`/`)

      dispatch(
        Mobilemenu({
          mobileMenuToggle: false,
        })
      );

            navigate(`/`)

    
    }
    
  };

  return (
    <header className="fixed  z-20 bg-yellow-500 md:bg-yellow-500 lg:bg-yellow-500 sm:bg-blue-500  text-white    w-screen  shadow-sm shadow-green-100 ">
      <div className="flex  justify-between  py-3 xl:py-0 ">
        <div className="flex   xl:ml-10 gap-10">
          {/* <button
            onClick={handleMenu}
            className="text-gray-500 ml-5 mt-2 xl:hidden  dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
            aria-label="toggle menu"
          >
            <IoIosMenu className="w-7 h-7   text-white " />
          </button> */}

          {/* <button
            className="text-xl font-inter font-extrabold mt-2"
            onClick={() => {
              dispatch(Mobilemenu({ mobileMenuToggle: false }));
              navigate("/");
            }}
          >
            Grocery
          </button> */}

          <div
            className="header cursor-pointer ml-10"
            onClick={() => {
              dispatch(Mobilemenu({ mobileMenuToggle: false })); // Close mobile menu
              navigate("/"); // Navigate to the homepage
              window.location.reload(); // Reload the page
            }}
          >
            <img
              src={logo}
              alt="Logo"
              className="sm:w-14 md:w-14 lg:w-14 xl:w-20 w-14 mt-1 h-auto"
            />
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

        <div className="xl:hidden mr-7   flex  gap-7">
          <li
            className="flex gap-1 items-center cursor-pointer mt-2"
            onClick={() => {
              dispatch(Mobilemenu({ mobileMenuToggle: false }));
              navigate("/viewCart");
            }}
          >
            <MdOutlineShoppingCart className="w-6 h-6 mt-1" />
            <span className="mt-1 hidden xl:block ">Cart</span>
          </li>


          

          <li className="flex gap-1 items-center cursor-pointer mt-2">
            <button className="font-inter  text-white">Login</button>
          </li>

          <li className="flex gap-1 items-center cursor-pointer mt-2" onClick={handleMenu}>
                <FaRegUserCircle  className="w-5 h-5" />
          </li>



        </div>

        <ul className="gap-10  hidden xl:flex mr-12">
          <li className="relative z-20    group mt-1  py-4 hidden  xl:block  ">
            {AreaPin ? (
              <div>
                <div
                  className="flex gap-1   cursor-pointer"
                  onClick={handleCurrentLocation}
                >
                  <h1>{AreaPin}</h1>
                  <MdOutlineLocationOn className="mt-1" />
                </div>

                <div className="hidden -z-10 right inset-0 bg-opacity-40 bg-black flex group-hover:block justify-center items-center  ">
                  <div className="absolute border-b top-14 shadow-lg shadow-black bg-white self-start flex flex-col justify-start rounded-md p-4  w-80">
                    <span className="font-inter font-semibold text-black">
                      Where do you want the delivery ?
                    </span>
                    <p className="text-gray-500 font-inter text-[12px]">
                      Only available in selected cities
                    </p>

                    <div className="flex border p-1 border-red-500 self-start text-black py-2   mt-4 gap-5 mb-4 ">
                      <input
                        value={pincode}
                        onChange={handleChange}
                        type="text"
                        className="border-r-2 self-start   focus:outline-none px-2 w-28"
                        placeholder="Enter pincode"
                      />
                      <div
                        className="text-blue-600 flex gap-2 cursor-pointer"
                        onClick={handleCurrentLocation}
                      >
                        <FaLocationCrosshairs className="mt-1 " />
                        <span>Current Location</span>
                      </div>
                    </div>

                    <div className="border-t-2 py-3 text-start">
                      <button className="font-inter  text-blue-500">
                        Login{" "}
                        <span className="text-black text-[14px] font-semibold">
                          to see you saved addresses
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className="flex gap-1   cursor-pointer"
                  onClick={handleCurrentLocation}
                >
                  <h1>Select city</h1>
                  <MdOutlineLocationOn className="mt-1" />
                </div>

                <div className="fixed -z-10 right inset-0 bg-opacity-40 bg-black flex justify-center items-center  ">
                  <div className="absolute border-b shadow-lg shadow-black top-14 bg-white self-start flex flex-col justify-start rounded-md p-4">
                    <span className="font-inter font-semibold text-black">
                      Verify Delivery pincode
                    </span>
                    <p className="text-gray-500 font-inter text-[12px]">
                      Only available in selected cities
                    </p>

                    <div className="flex border p-1 border-red-500 self-start text-black py-2   mt-4 gap-5 mb-4 ">
                      <input
                        value={pincode}
                        onChange={handleChange}
                        type="text"
                        className="border-r-2 self-start   focus:outline-none px-2"
                        placeholder="Enter pincode"
                      />
                      <div
                        className="text-blue-600 flex gap-2 cursor-pointer"
                        onClick={handleCurrentLocation}
                      >
                        <FaLocationCrosshairs className="mt-1 " />
                        <span>Current Location</span>
                      </div>
                    </div>

                    <div className="border-t-2 py-3 text-start">
                      <button className="font-inter  text-blue-500">
                        Login <span>to see you saved addresses</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>

          <li className="relative   group mt-1  py-4 hidden xl:block">
            <div
              className="flex gap-1  hover:text-blue-700 cursor-pointer"
              onClick={() => !email && !name && handleLogin}
            >
              <h1>
                {(email && !name && email) ||
                  (name && !email && name) ||
                  (!name && !email && "Login") ||
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
                  <div
                    className="flex gap-2"
                    onClick={() => navigate("profile/mywishlist")}
                  >
                    <FaHeart className="mt-1" />
                    <span>Wishlist</span>
                  </div>
                </li>
                <li className="group hover:text-blue-500 border-b-2 py-2">
                  <div
                    className="flex gap-2 "
                    onClick={() => navigate("profile/giftcards")}
                  >
                    <MdCardGiftcard className="mt-1" />
                    <span>Gift Card</span>
                  </div>
                </li>

                <li
                  onClick={() => navigate("profile/allnotifications")}
                  className="group hover:text-blue-500 border-b-2 py-2"
                >
                  <div className="flex gap-2">
                    <BiNotification className="mt-1" />
                    <span>Notification</span>
                  </div>
                </li>
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

          <li className="relative  group hidden xl:block mt-1 cursor-pointer py-4  hover:text-blue-700">
            <div className="flex gap-1 hover:text-blue-700 cursor-pointer">
              <h1>More</h1>
              <MdOutlineKeyboardArrowDown className="mt-1" />
            </div>

            <div className="absolute px-3 left-0  hidden self-center  bg-gray-100  shadow-lg  mt-4 w-56 py-4 group-hover:block z-10">
              <ul className="text-black flex flex-col  gap-4 cursor-pointer p-2 ">
                <li className="group hover:text-blue-500 border-b-2 py-2">
                  <div className="flex gap-2">
                    <FaRegUserCircle className="mt-1" />
                    <span className="font-extralight ">Download App</span>
                  </div>
                </li>
              </ul>
            </div>
          </li>

          <li
            className="flex gap-1 items-center cursor-pointer relative"
            onClick={() => navigate("/viewCart")}
          >
            <MdOutlineShoppingCart className="w-6 h-6 mt-1" />
            <span className="mt-1 ">Cart</span>
            {console.log(reduxcartItems)}
            {reduxcartItems.length > 0 && (
              <span className="absolute top-1 right-10 bg-red-500   text-white text-sm rounded-full px-1 ">
                {reduxcartItems.length}
              </span>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
