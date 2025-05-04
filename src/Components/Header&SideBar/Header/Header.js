import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { SlArrowUpCircle } from "react-icons/sl";
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
// import logo from "../../../assets/Logo/retail_dukaan_images.png";
import { RiUser6Line } from "react-icons/ri";
import { checkPincodeAvailability } from "../../CrudOperations/GetOperation";
import NavPincode from "./NavPincode";
import NavLogin from "./NavLogin";
import NavMore from "./NavMore";
import NavCart from "./NavCart";
import { logo } from "../../CrudOperations/customURl";

const Header = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);
  const [openLoginDiv, setOpenLoginDiv] = useState(false);


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

  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       console.log({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       });
  //     });
  //   } else {
  //     console.log("Geolocation is not available in your browser.");
  //   }
  // }, []);

  const handleCurrentLocation = () => {
    console.log("Fetching current location...");
  
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
      return;
    }
  
    // Success callback
    const onSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Latitude:", latitude, "Longitude:", longitude);
      fetchAddressFromCoords(latitude, longitude);
  
      
    };
  
    // Error callback
    const onError = (error) => {
      const errorMessages = {
        1: "Permission denied. Please enable location services.",
        2: "Position unavailable. Unable to determine your location.",
        3: "Timeout. Location request took too long.",
        default: "An unknown error occurred while fetching location.",
      };
  
      const message = errorMessages[error.code] || errorMessages.default;
      console.error(message);
      alert(message);
    };
  
    // Geolocation options
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // Timeout after 10 seconds
      maximumAge: 0,  // No cached position
    };
  
    // Fetch the current location
    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  };
  

  // Function to fetch address details from coordinates
  const fetchAddressFromCoords = async (latitude, longitude) => {

    try {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data received from API:", data);

      // Example: Check pincode availability
      if (data.address && data.address.postcode) {


        const pincodeResponse = await checkPincodeAvailability(data.address.postcode);
        console.log("Response from checkPincodeAvailability:", pincodeResponse);

        if (pincodeResponse && pincodeResponse.message === "Available") {
          dispatch(updateAreaPin({ pincode: data.address.postcode }));
          setIsValid(true);
          setPincodeInfo(data.address);
        } 
      } else {
        console.error("Pincode not found in address data.");
      }



    } catch (error) {
      console.error("Error fetching location data:", error);
      alert("An error occurred while fetching location data.");
    }
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

  const handleProfile = ()=>{

    if(!loginActive){

      setOpenLoginDiv(true);



    }






  }

  return (
    <header className="fixed z-40 w-screen h-16 text-black text-[14px] shadow-sm shadow-green-100 bg-gradient-to-b from-green-300 to-white">
      <div className="flex  justify-between  py-3 xl:py-0 ">
        <div className="flex   xl:ml-10 gap-10">
       

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

          {/* <div className="ml-10 hidden md:flex items-center relative">
            <input
              type="text"
              id="search"
              placeholder="Search"
              className="rounded-lg w-96 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute right-4 text-gray-500" />
          </div> */}



        </div>

        <ul className="gap-10  xl:flex hidden xl:mr-40">

      <NavPincode/>

<NavLogin/>

<NavMore/>

<NavCart/>
       



        

       
        </ul>



      </div>
    </header>
  );
};

export default Header;
