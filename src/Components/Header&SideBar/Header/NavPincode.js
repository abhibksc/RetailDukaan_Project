import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { MdOutlineLocationOn } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { activePages, updateAreaPin } from "../../ReduxStore/Slices/auth";
import { Mobilemenu } from "../../ReduxStore/Slices/toggleSlice";
import { checkPincodeAvailability } from "../../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import useWindowSize from "../../useWindowSize";

const NavPincode = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // setLoading

  const mobilebarToggle = useSelector((state) => state.toggle.mobileMenuToggle);
  const email = useSelector((state) => state.auth.email);
  const AreaPin = useSelector((state) => state.auth.AreaPin);
  const [isVibrating, setIsVibrating] = useState(false);

  const [pincode, setPincode] = useState(AreaPin);
  const [isValid, setIsValid] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState(null);

  const { width } = useWindowSize(); // Get the screen width

     useEffect(() => {

      if(pincode){

        
        // document.body.classList.add("modal-open");
        // return () => {
        //   document.body.classList.remove("modal-open");
        // };



      }
      else if(width >= 1024){
         

        document.body.classList.add("modal-open");
        return () => {
          document.body.classList.remove("modal-open");
        };


      }
       
      }, [pincode]);


  const verifyPincode = async (pincode) => {
    setLoading(true);
    // Replace with your actual Postman Pincode API endpoint
    const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;
    console.log(apiEndpoint);

    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      if (data[0].Status === "Success") {


         const AvailabilityResponse = await checkPincodeAvailability(pincode);
                  console.log(AvailabilityResponse);
                  
        
                  if(AvailabilityResponse && AvailabilityResponse.data.message === "Available"){
        
                    dispatch(updateAreaPin({ pincode: pincode }));
                    setIsValid(true);
                    setPincodeInfo(data[0].PostOffice);
        
                  }
                  else if(AvailabilityResponse && AvailabilityResponse.data.message === "Not Available"){
              
        
                    triggerVibration()
                    setIsValid(false);
                    setPincodeInfo(null);
                    setPincode(AreaPin)
                    toast.warn("Sorry, delivery services are unavailable in your location.");
        
                  }
                  else{
        
                    triggerVibration()
                    setIsValid(false);
                    setPincodeInfo(null);
                  }

















      } else {
        toast.warn("wrong pincode");
        triggerVibration();
        setPincode(AreaPin);
        setIsValid(false);
        setPincodeInfo(null);
      }
    } catch (error) {
      console.error("Error verifying pincode:", error);
      setIsValid(false);
      setPincodeInfo(null);
    }

    setLoading(false);
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

  const handleCurrentLocation = () => {
    setLoading(true);
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
      maximumAge: 0, // No cached position
    };

    // Fetch the current location
    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  };

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 1000); // Stop vibration after 3 seconds
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
           setPincode(data.address.postcode)
           const pincodeResponse = await checkPincodeAvailability(data.address.postcode);
           console.log("Response from checkPincodeAvailability:", pincodeResponse);
   
   
   
   
   
   
   
             
   
             if(pincodeResponse && pincodeResponse.data.message === "Available"){
   
               dispatch(updateAreaPin({ pincode: data.address.postcode }));
               setIsValid(true);
               setPincodeInfo(data.address);
               setLoading(false);
   
   
   
   
             }
             else if(pincodeResponse && pincodeResponse.data.message === "Not Available"){
               toast.warn("Sorry, delivery services are unavailable in your location.");
   
   
               setIsValid(false);
               setLoading(false);
               triggerVibration()
   
   
   
               setPincodeInfo(null);
               setPincode(AreaPin)
   
             }
             else{
   
               triggerVibration()
               setIsValid(false);
               setPincodeInfo(null);
   
   
               setLoading(false);
               setPincode("")
               
               toast.warn("Pincode not found or incorrect pincode.");
   
             }
   
   
    
       } 
      
      
      
      
      
      
      
      
      else {
        toast.warn("Pincode not found or incorrect pincode.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      alert("An error occurred while fetching location data.");
    }
  };

  return AreaPin && (
    <li className="relative z-20 group mt-1 py-4  hidden xl:block">
      {AreaPin ? (
        <div>
          <div
            className="flex gap-1 cursor-pointer  py-1"
            onClick={handleCurrentLocation}
          >
            <h1>{AreaPin}</h1>
            <MdOutlineLocationOn className="mt-1" />
          </div>

          <div className="hidden -z-10 right  inset-0 bg-opacity-40  flex group-hover:block justify-center items-center">
            <div
              className={`absolute border-b shadow-lg shadow-black top-14  bg-white self-start flex flex-col justify-start rounded-md p-4 ${
                isVibrating ? "vibrate" : ""
              }`}
            >
              <span className="font-inter font-semibold text-black">
                Where do you want the delivery?
              </span>
              <p className="text-gray-500 font-inter text-[12px]">
                Only available in selected cities
              </p>

              <div className="flex border p-1 border-red-500 self-start text-black py-2 mt-4 gap-5 mb-4">
                <input
                  value={pincode}
                  onChange={handleChange}
                  type="text"
                  className="border-r-2 self-start focus:outline-none px-2"
                  placeholder="Enter pincode"
                />
                <div
                  className="text-blue-600 flex gap-2 cursor-pointer"
                  onClick={handleCurrentLocation}
                >
                  <FaLocationCrosshairs className="mt-1" />
                  <span>Location</span>
                </div>
              </div>

              {loading && (
                <div className="flex items-center  ">
                  <div className="spinner-border animate-spin inline-block w-3 h-3 border-4 rounded-full border-blue-300 border-t-transparent font-thin"></div>
                  <span className="ml-2 text-black">Detecting location...</span>
                </div>
              )}

              <div className="border-t-2 py-3 text-start">
                <button className="font-inter text-blue-500">
                  Login{" "}
                  <span className="text-black text-[14px] font-semibold">
                    to see your saved addresses
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="fixed -z-10 right inset-0 bg-opacity-40 bg-black flex justify-center items-center">
            <div className="absolute border-b shadow-lg shadow-black top-14 bg-white self-start flex flex-col justify-start rounded-md p-4">
              Not ServiceAble Area!!!!!
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default NavPincode;
