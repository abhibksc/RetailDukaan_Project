import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { MdOutlineLocationOn } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import {  setLat_Long_Location, updateAreaPin } from "../../ReduxStore/Slices/auth";
import { checkPincodeAvailability } from "../../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import useWindowSize from "../../useWindowSize";
import { fetchHomeData } from "../../ReduxStore/Slices/homeSlice";

const NavPincode = () => {
  const [loading, setLoading] = useState(false);

  

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // setLoading

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


        async function getLatLongFromPincode(pincode) {
          const apiKey = "2b803d74b243492a860e3659937ab0a4"; // Replace with your actual API key
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${apiKey}`;
      
          try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            
      
            if (data.results.length > 0) {
      
              const { lat, lng } = data.results[0].geometry;
              return { latitude: lat, longitude: lng };
            } else {
              toast.error("No results found for this pincode.");
      
              return null;
            }
          } catch (error) {
            toast.error("Error fetching coordinates:", error);
            return null;
          }
        }


   const verifyPincode = async (pincode) => {
     setLoading(true);
     // Replace with your actual Postman Pincode API endpoint
     const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;
 
     try {
       const response = await fetch(apiEndpoint);
       const data = await response.json();
       console.log(data);
       
 
       if (data[0].Status ==="Success") {
         const getLat_Long = await getLatLongFromPincode(pincode);
       console.log(getLat_Long);
 
 
         if (getLat_Long.latitude && getLat_Long.longitude) {
       console.log(getLat_Long);
 
           await fetchAddressFromCoords(
             getLat_Long.latitude,
             getLat_Long.longitude
           );
         } else {
           toast.error("Lat Long Data Not Found!!");
         }
 
       } else {
         toast.warn("wrong pincode");
         triggerVibration();
           setLoading(false);
 
         setIsValid(false);
         setPincodeInfo(null);
       }
     } catch (error) {
       setIsValid(false);
       setPincodeInfo(null);
     }
     finally{
           setLoading(false);
 
     }
 
     // setLoading(false);
   };

  // Handle Current location

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
          ({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
        ("Geolocation is not available in your browser.");
    }
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;

    setPincode(value);
    if (value.length === 6) {
      console.log(value);
      
      verifyPincode(value);
    } else {
      setIsValid(null);
      setPincodeInfo(null);
    }
  };

  const handleCurrentLocation = () => {
    setLoading(true);
      ("Fetching current location...");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
        ("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Success callback
    const onSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
        ("Latitude:", latitude, "Longitude:", longitude);

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

      // Example: Check pincode availability
      if (data.address && data.address.postcode) {
        const pincodeResponse = await checkPincodeAvailability(
          data.address.postcode
        );

        console.log(pincodeResponse);
        

        if (pincodeResponse?.data?.message === "Available") {
          dispatch(updateAreaPin({ pincode: data.address.postcode }));
          dispatch(
            setLat_Long_Location({ Latitude: latitude, Longitude: longitude })
          );

            dispatch(fetchHomeData(data.address.postcode)); // where '110001' is the pincode

          setIsValid(true);
          setPincodeInfo(data.address);
          setLoading(false);
          navigate("/")

          window.location.reload();

         
          
        } else
        {
          toast.warn(pincodeResponse?.data?.message || pincodeResponse?.data?.error );
          setIsValid(false);
          setLoading(false);
          triggerVibration();
        }
      } else {
        toast.warn("Pincode not found or incorrect pincode.");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      
      alert("An error occurred while fetching location data.");
    }
    finally{
          setLoading(false);

    }
  };

  return AreaPin && (
    <li className="relative z-20 group mt-1 py-4 text-[12px]  hidden xl:block">
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
