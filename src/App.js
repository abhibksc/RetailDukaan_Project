import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import UserProfile from "./Components/UserProfile/UserProfile";
import HomePage from "./Components/Home/HomePage";
// import Header from "./Components/Header&SideBar/Header";
import Footer from "./Components/Footer/Footer";
import NotFound from "./Components/Errors/NotFound";
import {
  activeMobileLoginPages,
  activePages,
  setLat_Long_Location,
  signIn,
  updateAreaPin,
} from "./Components/ReduxStore/Slices/auth";
import ViewCart from "./Components/ViewCart/ViewCart";
import SuperAdminRoute from "./Components/SuperAdmin/SuperAdminRoute";
import AdminSuperAdminAuth from "./Components/AdminSuperAdminAuth/AdminSuperAdminAuth";
import MegaMenu from "./Components/Header&SideBar/MegaMenu";
import LoginModal from "./Components/UserAuth/LoginModal";
import Orders from "./Components/UserProfile/Orders/Orders";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Single_Product_page from "./Components/Product/Single_Product_page";
import Product_Listing_Page from "./Components/Product/Product_Listing_Page";
import CheckOut from "./Components/CheckOut/CheckOut";
import baseurl, { baseUIurl } from "./Components/CrudOperations/customURl";
import Header from "./Components/Header&SideBar/Header/Header";
import LargeScreenHomePage from "./Components/Home/Lage Screen/LargeScreenHomePage";
import SmallScreenHomePage from "./Components/Home/Small Screen/SmallScreenHomePage";
import useWindowSize from "./Components/useWindowSize";
import FooterBar from "./Components/Footer/FooterBar";
import SUserProfile from "./Components/SmallScreenUserProfile/SUserProfile";
import Orderpanel from "./Components/UserProfile/Orders/Orderpanel";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { checkPincodeAvailability, getAllCartItems } from "./Components/CrudOperations/GetOperation";
import FooterBasePage from "./Components/Footer/FooterBasePage";
import ProductBase from "./Components/Product/ProductBase";
import { addCart, importCartItems } from "./Components/ReduxStore/Slices/cartSlice";
import MobileHeader from "./Components/ViewCart/MobileViewCart/MobileHeader";
import UiMobileHeader from "./Components/Header&SideBar/MobileHeader/UiMobileHeader";
import useAddressActions from "./Components/Product/useAddressActions";
import SOrderpanel from "./Components/SmallScreenUserProfile/Orders/SOrderpanel";
import ShopByCategoryBase from "./Components/Home/Small Screen/ShopByCategory/ShopByCategoryBase";
import AllSmallProducts from "./Components/Home/Small Screen/ShopByCategory/AllSmallProducts";
import useImportUserDetails from "./Components/useImportUserDetails";
import SingleSmallProduct from "./Components/Home/Small Screen/SingleSmallProduct";
import { SenduserAuthenticationOTP, userLogin } from "./Components/CrudOperations/PostOperation";
import { Update_LatLongInData_Base } from "./Components/CrudOperations/Update&Edit";
import CheckOutPanel from "./Components/CheckOut/CheckOutPanel";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const registered = useSelector((state) => state.auth.registered);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!registered) {
      dispatch({
        type: "auth/activePages",
        payload: { login: true, signup: false },
      });
    }




  }, [registered, dispatch]);

  if (!registered) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const UserTypeHandler = () => {
  const { userType } = useParams(); // Extract userType from the URL


  const superadmintoken = localStorage.getItem("superadmintoken");
  const admintoken = localStorage.getItem("Merchanttoken");



  return (
    <Routes>
      <Route path="/login" element={<AdminSuperAdminAuth />} />

      {userType === "superadmin" && superadmintoken && (
        <Route path="*" element={<SuperAdminRoute />} />
      )}

      {userType === "admin" && admintoken && (
        <Route path="*" element={<AdminPanel />} />
      )}

      {userType === "Merchant" && admintoken && (
        <Route path="*" element={<AdminPanel />} />
      )}

      {userType === "Manager" && (
        <Route
          path="*"
          element={
            <>
              <div className="text-center text-2xl font-bold text-red-500 mt-10">
                Manager Dashboard Comming Soon...........
              </div>
            </>
          }
        />
      )}
    </Routes>
  );
};


const MobileLoginModal = () => {
 
   const [input, setinput] = useState("");
   const [Inputtype, setInputtype] = useState("");
 
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
 
    const Location = useSelector((state) => state.auth.Location);
    const Customer_userId = useSelector((state) => state.auth.Customer_userId);
 
 
   const dispatch = useDispatch();
 
   
   const [modalIsOpen, setModalIsOpen] = useState(true);
   const [isSignup, setIsSignup] = useState(false);
   const [otpDetails,setOTPDetails] = useState(null);
   const [otpDone,setOtpDone] = useState(null);
  

    const mobile_login_pageActive = useSelector(
      (state) => state.auth.mobile_login_pageActive
    );


      const handleSendOTP = async (e) => {
        e.preventDefault();
    
    
        console.log(input);
    
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/; // Assumes a 10-digit Indian mobile number
        let type = null;
        let MyInput = null;
      
        if (emailRegex.test(input)) {
          MyInput = emailRegex;
          type = "email";
        } else if (phoneRegex.test(input)) {
          MyInput = phoneRegex;
          type = "phone" ;
        } else {
          toast.warn("Invalid Input");
        }
    
        setInputtype(type)
        
    
    
    
    
        try {
          if (MyInput) {
    
            console.log(otpDetails);
            
    
    
          if(otpDetails && otpDetails.otp && otpDetails.otp_id){
    
    
              const response = await userLogin({ input : input , type : type , otp : otpDetails.otp , otp_id :  otpDetails.otp_id });
    
              console.log(response);
      
      
              if (response && response.message === "Login successful.") {
    
    
    
    
    
    
              dispatch(
                signIn({
                  token: response.token,
                  name: response.user.name,
                  phone: response.user.phone,
                  email : response.user.email,
                  Customer_userId: response.user.id,
                  Unique_UserID: response.user.Unique_userId,
                  userlogin: true,
                  registered : true,
                  login: false,
                  mobile_login_pageActive : false
    
    
                })
              );
    
              console.log(Location);
              console.log(response.user.id);
    
              
    
              if(Location.Latitude && Location.Longitude && response.user.id){
                const updateInDataBase = await Update_LatLongInData_Base({latitude : Location.Latitude, longitude : Location.Longitude, id : response.user.id});
                console.log(updateInDataBase);
                
                
              }
    
    
    
    
    
    
    
                toast.success(response.message)
      
                setOTPDetails(null)
    
                setinput("")
                setInputtype("")
                setOtpDone(false);
    
    
    
    
              }
              else if (response && response.message === "Registration successful.") {
                dispatch(
                  signIn({
                    token: response.token,
                    email : response.user.email,
                    name: response.user.name,
                    phone: response.user.phone,
                    Customer_userId: response.user.id,
                    Unique_UserID: response.user.Unique_userId,
                    userlogin: true,
                    registered : true,
                    login: false,
                    mobile_login_pageActive : false
      
                  })
                );
      
    
                if(Location.Latitude && Location.Longitude && response.user.id){
                  const updateInDataBase = await Update_LatLongInData_Base({latitude : Location.Latitude, longitude : Location.Longitude, id : response.user.id});
                  console.log(updateInDataBase);
                  
                  
                }
      
      
                  toast.success(response.message)
        
                  setOTPDetails(null)
    
    
              }
    
              else if (response && response.message === "Welcome back to Retail Dukaan!") {
                dispatch(
                  signIn({
                    token: response.token,
                    name: response.user.name,
                    phone: response.user.phone,
                    email : response.user.email,
                    Customer_userId: response.user.id,
                    Unique_UserID: response.user.Unique_userId,
                    userlogin: true,
                    registered : true,
                    login: false,
                    mobile_login_pageActive : false
      
                  })
                );
      
    
                if(Location.Latitude && Location.Longitude && response.user.id){
                  const updateInDataBase = await Update_LatLongInData_Base({latitude : Location.Latitude, longitude : Location.Longitude, id : response.user.id});
                  console.log(updateInDataBase);
                  
                  
                }
      
      
                  toast.success(response.message)
        
                  setOTPDetails(null)
    
    
              }
    
    
    
    
    
    
              
              else{
                toast.error(response.message)
                setOTPDetails(null)
                setinput("")
                setInputtype("")
                setOtpDone(false);
      
              }
    
    
    
    
    
          }
    
          else if(!otpDone) {
    
    
    
              // const response = await userLogin({ input : input , type : type });
    
              const response = await SenduserAuthenticationOTP({ input : input , type : type });
    
              console.log(response);
      
      
              if (response && response.message === "OTP sent successfully.") {
                toast.success(response.message)
      
                setOTPDetails({
                  otp_id : response.otp_id,
                })
                setOtpDone(true);
              }
              else{
                toast.success(response.message)
      
              }
      
          }
          else{
            console.log("OTP Verification");
          }
    
    
    
    
    
    
            
            // if (response) {
    
            //   const token = localStorage.getItem("token");
    
            //   console.log(token);
    
            //   dispatch(
            //     signIn({
            //       token: token,
            //       input: response.input,
            //       name: response.name,
            //       phone: response.phone,
            //       userId: response.id,
            //       userlogin: true,
            //     })
            //   );
            //   dispatch(registered(true));
            //   close();
            // }
    
    
    
    
    
    
          }
        } catch (error) {
          console.error("Error logging in:", error);
        }
    
      };


       const handleResendOTP = async (e) => {
      
          try {
      
            console.log(otpDetails);
            console.log();
            console.log();
            
            if (otpDetails && otpDetails.otp_id && Inputtype) {
              const response = await SenduserAuthenticationOTP({ input : input , type : Inputtype });
      
              console.log(response);
        
        
              if (response && response.message === "OTP sent successfully.") {
                toast.success("Resend OTP sent successfully.")
        
                setOTPDetails({
                  otp_id : response.otp_id,
                })
              }
              else{
                toast.success(response.message)
        
              }
            }
          } catch (error) {
            console.error("Error logging in:", error);
          }
      
      
      
        
      
        };


  return (
   <div>
     {/* Login Modal */}
            {mobile_login_pageActive && (
              <div className="fixed z-50 inset-0 flex items-end justify-center bg-black bg-opacity-50">
                <div className="w-full bg-black text-white p-5 rounded-t-lg shadow-lg relative">
                  {/* Close Button */}
                  <button
                    className="absolute top-3 z-30  right-5 text-white hover:text-red-500 text-xl"
                    onClick={() =>
                      dispatch(activeMobileLoginPages({ login: false }))
                    }
                  >
                    &times;
                  </button>
    
                  <div className="flex-1">
                    <form
                      className="relative flex flex-col justify-center p-6"
                      onSubmit={handleSendOTP}
                    >
                      <h1 className="text-2xl mb-4 text-center font-semibold">
                        Login/Signup
                        <br />
                        <span className="text-sm border-b-2 border-yellow-400 pb-1">
                          Using OTP
                        </span>
                      </h1>
    
                      <div className="px-6 flex flex-col gap-6 text-center">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setinput(e.target.value)}
                          placeholder="Enter Phone Number/Email Id"
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 focus:border-yellow-400 focus:ring focus:ring-yellow-300 text-white"
                        />
    
    {
                      otpDetails && otpDetails.otp_id && <div className="flex flex-row gap-3 w-full">

                      <input type="number" 
                        className="p-2 max-w-40 text-gray-300 rounded focus:outline-none bg-black border-b"
                        value={otpDetails.otp}
                        onChange={(e) => setOTPDetails({...otpDetails,otp : e.target.value})}
                        />

                        <button type="button" 
                        className="border w-full p-2 rounded-md bg-yellow-600 text-black font-medium hover:bg-yellow-600 transition-all mx-auto" onClick={handleResendOTP}>
                          resend
                        </button>



                      </div>
                    }
    
                        <button
                          type="submit"
                          className="border w-32 p-2 rounded-md bg-yellow-500 text-black font-medium hover:bg-yellow-600 transition-all mx-auto"
                        >
                          Verify OTP
                        </button>
    
                        <div className="text-xs text-gray-400 leading-tight">
                          By continuing, I accept TCP - retaildukaan{" "}
                          <span className="text-yellow-400">
                            Terms and Conditions
                          </span>{" "}
                          & <span className="text-yellow-400">Privacy Policy</span>.
                          <br />
                          This site is protected by reCAPTCHA and the Google{" "}
                          <span className="text-yellow-400">
                            Privacy Policy
                          </span> &{" "}
                          <span className="text-yellow-400">Terms of Service</span>{" "}
                          apply.
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
   </div>
  );
};

// AppContent Component
const AppContent = () => {

  const registered = useSelector((state) => state?.auth?.registered);
  const Merchant_registered = useSelector((state) => state.auth.Merchant_registered);






  const { width } = useWindowSize(); // Get the screen width
  const loginPageActive = useSelector((state) => state.auth.loginpageActive);
  const AreaPin = useSelector((state) => state.auth.AreaPin);

  const userName = useSelector((state) => state.auth.name);

  const MobileNumber = useSelector((state) => state.auth.phone);
  const email = useSelector((state) => state.auth.email);
  const address = useSelector((state) => state.auth.address);





  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [admin, setAdmin] = useState(false);
  const [isServiceAble, setIsServiceAble] = useState(false);
  const [pincode, setPincode] = useState(AreaPin);
  const [isValid, setIsValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const  {ImportAddress} =  useAddressActions();
  const  {importDetails} =  useImportUserDetails();



  const [isVibrating, setIsVibrating] = useState(false);

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 1000); // Stop vibration after 3 seconds
  };

    const verifyPincode = async (pincode) => {
      setLoading(true);
      // Replace with your actual Postman Pincode API endpoint
      const apiEndpoint = `https://api.postalpincode.in/pincode/${pincode}`;
  
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        if (data[0].Status === "Success") {
          dispatch(updateAreaPin({ pincode: pincode }));
          setIsValid(true);
          setPincodeInfo(data[0].PostOffice);
        } else {
          toast.warn("wrong pincode");
          triggerVibration()
          setIsValid(false);
          setPincodeInfo(null);
        }
      } catch (error) {
        setIsValid(false);
        setPincodeInfo(null);
      }

      setLoading(false);
    };


    useEffect(() => {
      // Check if the current path is related to admin/merchant/etc.
      const pathMatch = location.pathname.match(/^\/(admin|superadmin|merchant|manager)\//);
      const isAdmin = pathMatch !== null;
    
      // If not an admin, proceed with profile validation and redirection logic
      if (!isAdmin) {
        // Check if the user is registered and if name or mobile number is missing
        if (width >= 1024 && registered && (!userName || !MobileNumber)) {
          toast.warn("Please fill name, mobile number");
          navigate("/profile");
          return;
        } else if (width < 1024 && registered && (!userName || !MobileNumber)) {
          toast.warn("Please fill name, mobile number");
          navigate("/profile/personal-Information");
          return;
        }
    
        // Check if the address is missing
        if (width >= 1024 && registered && (!address || address.length === 0)) {
          toast.warn("Please add a delivery address");
          navigate("/profile/addresses");
          return;
        } else if (width < 1024 && registered && (!address || address.length === 0)) {
          toast.warn("Please add a delivery address");
          navigate("/profile/addresses");
          return;
        }
      }
      else{

if(!Merchant_registered){
  console.log("Merchant not registered");
  

  navigate("admin/login")



}



        console.log("Admin Route");
        setAdmin(true);
        
      }


    }, [width, registered, userName, MobileNumber, address, location.pathname]);
    


    useEffect(() => {
      

if(registered){
  
  const fun = async()=>{

    const response = await getAllCartItems()
    console.log(response);
    
    


    if(response && response.data.message === 'Cart items retrieved successfully!'){
      dispatch(importCartItems(response.data))
    }

    else{
      // toast.error(response.data.message);
      console.log(response);
      
    }


    ImportAddress();


    

  }
  fun();
}




    }, [registered,dispatch]);




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

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Success callback
    const onSuccess = async (position) => {
      const { latitude, longitude } = position.coords;

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

        if (pincodeResponse && pincodeResponse.data.message === "Available") {




          dispatch(updateAreaPin({ pincode: data.address.postcode }));
          dispatch(setLat_Long_Location({Latitude: latitude  , Longitude: longitude}));

          setIsValid(true);
          setPincodeInfo(data.address);
          setLoading(false);
          setIsServiceAble(true)
        } else if (
          pincodeResponse &&
          pincodeResponse.data.message === "Not Available"
        ) {
        toast.warn("Service not available in your area");
          setIsValid(false);
          setLoading(false);
          triggerVibration()
        }
      } else {
        toast.warn("Pincode not found or incorrect pincode.");
        setLoading(false);
      }
    } catch (error) {
      alert("An error occurred while fetching location data.");
    }
  };

  return (
    <>
      <ToastContainer />

      {loginPageActive && <LoginModal />}

      <Routes>
        {/* user Auth */}

        {/* Checkout route */}
        <Route
          path="/CheckOut/*"
          element={
            <ProtectedRoute>
              <CheckOutPanel />
            </ProtectedRoute>
          }
        />



        {admin && <Route path="/:userType/*" element={<UserTypeHandler />} />}

        {/* Main app routes */}
        {!admin && (
          <Route
            path="/*"
            element={
              <>
                {width >= 1024 ? (
                  AreaPin ? (
                    <div className="flex flex-col min-h-screen bg-white">
                      <div className="flex-grow">
                        <Header />
                        <MegaMenu />
                        <div className="md:hidden mx-auto w-72 mt-3 rounded-md border">
                          <input
                            type="text"
                            id="search"
                            placeholder="Search"
                            className="rounded-lg px-3 py-1"
                          />
                        </div>
                        <Routes>
                          <Route path="/" element={<LargeScreenHomePage />} />
                          <Route path="/page/*" element={<FooterBasePage />} />

                          <Route path="/Profile/*" element={<UserProfile />} />
                          <Route path="*" element={<NotFound />} />
                          <Route
                            path="/:grocery/*"
                            element={<ProductBase />}
                          />

                          <Route path="/Order/*" element={<Orderpanel />} />

                         
                        </Routes>

                        <Footer />
                      </div>
                    </div>
                  ) : (
                    <div className=" ">
                      <Header />
                      <LargeScreenHomePage />

                      <div className="fixed z-40 inset-0 bg-opacity-40 bg-black flex justify-center items-center">
                        <div
                          className={`absolute border-b shadow-lg shadow-black top-14 bg-white self-start flex flex-col justify-start rounded-md p-4 ${
                            isVibrating ? "vibrate" : ""
                          }`}
                        >
                          <span className="font-inter font-semibold text-black">
                            Verify Delivery Pincode
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
                              // onClick={triggerVibration}

                              onClick={handleCurrentLocation}
                            >
                              <FaLocationCrosshairs className="mt-1" />
                              <span>Current Location</span>
                            </div>
                          </div>


                          {loading && (
                            <div className="flex items-center  ">
                              <div className="spinner-border animate-spin inline-block w-3 h-3 border-4 rounded-full border-blue-300 border-t-transparent font-thin"></div>
                              <span className="ml-2 text-black">
                                Detecting location...
                              </span>
                            </div>
                          )}

                          {/* <div className="border-t-2 py-3 text-start">
                            <button className="font-inter text-blue-500">
                              Login <span>to see your saved addresses</span>
                            </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col ">
                  {/* Main content with flex-grow to push footer down */}
                  <div className="flex-grow">
                    <Routes>
                      <Route path="/" element={<SmallScreenHomePage />} />
                      <Route path="/Profile/*" element={<SUserProfile />} />
                      <Route path="/Order/*" element={<SOrderpanel />} />

                      <Route path="*" element={<NotFound />} />
                      <Route path="/Categoy" element={<ShopByCategoryBase />} />
                      <Route path="/:grocery" element={<AllSmallProducts />} />
                      <Route path="/grocery/:category" element={<AllSmallProducts />} />
                      <Route path="/grocery/:category/:subCategory" element={<AllSmallProducts />} />
                      <Route path="grocery/:category/:subCategory/:productItem/:item/:VariantId" element={<SingleSmallProduct />} />
                    </Routes>
<MobileLoginModal/>
                    
                  </div>
                
                  {/* Footer with relative position */}
                  <FooterBar />
                </div>
                
                )}
              </>
            }
          />
        )}

        <Route path="/viewCart" element={<ViewCart />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// Main App Component
const App = () => (
  <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-200">
    <AppContent />

  </div>
);

export default App;
