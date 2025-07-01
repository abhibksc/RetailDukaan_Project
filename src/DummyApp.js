import React, { lazy, Suspense, useEffect, useState } from "react";
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

// Lazy-loaded components
const AdminPanel = lazy(() => import("./Components/AdminPanel/AdminPanel"));
const UserProfile = lazy(() => import("./Components/UserProfile/UserProfile"));
const HomePage = lazy(() => import("./Components/Home/HomePage"));
const NotFound = lazy(() =>
  import("../src/assets/animations/404_notfound.json")
);
const ViewCart = lazy(() => import("./Components/ViewCart/ViewCart"));
const SuperAdminRoute = lazy(() =>
  import("./Components/SuperAdmin/SuperAdminRoute")
);
const AdminSuperAdminAuth = lazy(() =>
  import("./Components/AdminSuperAdminAuth/AdminSuperAdminAuth")
);
const MegaMenu = lazy(() => import("./Components/Header&SideBar/MegaMenu"));
const Orders = lazy(() => import("./Components/UserProfile/Orders/Orders"));
const Single_Product_page = lazy(() =>
  import("./Components/Product/Single_Product_page")
);
const Product_Listing_Page = lazy(() =>
  import("./Components/Product/Product_Listing_Page")
);
const CheckOut = lazy(() => import("./Components/CheckOut/CheckOut"));
const Header = lazy(() => import("./Components/Header&SideBar/Header/Header"));
const SmallScreenHomePage = lazy(() =>
  import("./Components/Home/Small Screen/SmallScreenHomePage")
);
const Footer = lazy(() => import("./Components/Footer/Footer"));
const FooterBar = lazy(() => import("./Components/Footer/FooterBar"));
const SUserProfile = lazy(() =>
  import("./Components/SmallScreenUserProfile/SUserProfile")
);
const Orderpanel = lazy(() =>
  import("./Components/UserProfile/Orders/Orderpanel")
);
const FooterBasePage = lazy(() => import("./Components/Footer/FooterBasePage"));
const ProductBase = lazy(() => import("./Components/Product/ProductBase"));
const MobileHeader = lazy(() =>
  import("./Components/ViewCart/MobileViewCart/MobileHeader")
);
const UiMobileHeader = lazy(() =>
  import("./Components/Header&SideBar/MobileHeader/UiMobileHeader")
);
const SOrderpanel = lazy(() =>
  import("./Components/SmallScreenUserProfile/Orders/SOrderpanel")
);
const ShopByCategoryBase = lazy(() =>
  import("./Components/Home/Small Screen/ShopByCategory/ShopByCategoryBase")
);
const AllSmallProducts = lazy(() =>
  import("./Components/Home/Small Screen/ShopByCategory/AllSmallProducts")
);
const SingleSmallProduct = lazy(() =>
  import("./Components/Home/Small Screen/SingleSmallProduct")
);
const CheckOutPanel = lazy(() => import("./Components/CheckOut/CheckOutPanel"));

import {
  activeMobileLoginPages,
  activePages,
  setLat_Long_Location,
  signIn,
  updateAreaPin,
  updateEmail,
  updateName,
  updateNumber,
} from "./Components/ReduxStore/Slices/auth";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import baseurl, { baseUIurl } from "./Components/CrudOperations/customURl";
import useWindowSize from "./Components/useWindowSize";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import {
  checkPincodeAvailability,
  getAllCartItems,
  GetUpdated_user____Addresss,
  GetUpdated_UserProfile,
} from "./Components/CrudOperations/GetOperation";
import {
  addCart,
  importCartItems,
} from "./Components/ReduxStore/Slices/cartSlice";
import useAddressActions from "./Components/Product/useAddressActions";
import useImportUserDetails from "./Components/useImportUserDetails";
import {
  SenduserAuthenticationOTP,
  userLogin,
} from "./Components/CrudOperations/PostOperation";
import { Update_LatLongInData_Base } from "./Components/CrudOperations/Update&Edit";
import LoginModal from "./Components/UserAuth/LoginModal";
import LoadingModal from "./Components/LoadingModal";
import UserMainContent from "./Components/Content/UserMainContent";
import ResetPasswordPage from "./Components/ResetPasswordPage";
import ReferralBasePage from "./Components/UserReferral/ReferralBasePage";
import Starting_Page_Base from "./Components/Home/Large_Screen/LargeStartingPage/Starting_Page_Base";
import { fetchHomeData } from "./Components/ReduxStore/Slices/homeSlice";

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

  const Location = useSelector((state) => state.auth.Location);

  const dispatch = useDispatch();

  const [otpDetails, setOTPDetails] = useState(null);
  const [otpDone, setOtpDone] = useState(null);

  const mobile_login_pageActive = useSelector(
    (state) => state.auth.mobile_login_pageActive
  );

  const handleSendOTP = async (e) => {
    e.preventDefault();

    input;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/; // Assumes a 10-digit Indian mobile number
    let type = null;
    let MyInput = null;

    if (emailRegex.test(input)) {
      MyInput = emailRegex;
      type = "email";
    } else if (phoneRegex.test(input)) {
      MyInput = phoneRegex;
      type = "phone";
    } else {
      toast.warn("Invalid Input");
    }

    setInputtype(type);

    try {
      if (MyInput) {
        otpDetails;

        if (otpDetails && otpDetails.otp && otpDetails.otp_id) {
          const response = await userLogin({
            input: input,
            type: type,
            otp: otpDetails.otp,
            otp_id: otpDetails.otp_id,
          });

          response;

          if (response && response.message === "Login successful.") {
            dispatch(
              signIn({
                token: response.token,
                name: response.user.name,
                phone: response.user.phone,
                email: response.user.email,
                Customer_userId: response.user.id,
                Unique_UserID: response.user.Unique_userId,
                userlogin: true,
                registered: true,
                login: false,
                mobile_login_pageActive: false,
              })
            );

            Location;
            response.user.id;

            if (Location.Latitude && Location.Longitude && response.user.id) {
              const updateInDataBase = await Update_LatLongInData_Base({
                latitude: Location.Latitude,
                longitude: Location.Longitude,
                id: response.user.id,
              });
              updateInDataBase;
            }

            toast.success(response.message);

            setOTPDetails(null);

            setinput("");
            setInputtype("");
            setOtpDone(false);
          } else if (
            response &&
            response.message === "Registration successful."
          ) {
            dispatch(
              signIn({
                token: response.token,
                email: response.user.email,
                name: response.user.name,
                phone: response.user.phone,
                Customer_userId: response.user.id,
                Unique_UserID: response.user.Unique_userId,
                userlogin: true,
                registered: true,
                login: false,
                mobile_login_pageActive: false,
              })
            );

            if (Location.Latitude && Location.Longitude && response.user.id) {
              const updateInDataBase = await Update_LatLongInData_Base({
                latitude: Location.Latitude,
                longitude: Location.Longitude,
                id: response.user.id,
              });
              updateInDataBase;
            }

            toast.success(response.message);

            setOTPDetails(null);
          } else if (
            response &&
            response.message === "Welcome back to Retail Dukaan!"
          ) {
            dispatch(
              signIn({
                token: response.token,
                name: response.user.name,
                phone: response.user.phone,
                email: response.user.email,
                Customer_userId: response.user.id,
                Unique_UserID: response.user.Unique_userId,
                userlogin: true,
                registered: true,
                login: false,
                mobile_login_pageActive: false,
              })
            );

            if (Location.Latitude && Location.Longitude && response.user.id) {
              const updateInDataBase = await Update_LatLongInData_Base({
                latitude: Location.Latitude,
                longitude: Location.Longitude,
                id: response.user.id,
              });
              updateInDataBase;
            }

            toast.success(response.message);

            setOTPDetails(null);
          } else {
            toast.error(response.message);
            setOTPDetails(null);
            setinput("");
            setInputtype("");
            setOtpDone(false);
          }
        } else if (!otpDone) {
          // const response = await userLogin({ input : input , type : type });

          const response = await SenduserAuthenticationOTP({
            input: input,
            type: type,
          });

          response;

          if (response && response.message === "OTP sent successfully.") {
            toast.success(response.message);

            setOTPDetails({
              otp_id: response.otp_id,
            });
            setOtpDone(true);
          } else {
            toast.success(response.message);
          }
        } else {
          ("OTP Verification");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleResendOTP = async (e) => {
    try {
      otpDetails;

      if (otpDetails && otpDetails.otp_id && Inputtype) {
        const response = await SenduserAuthenticationOTP({
          input: input,
          type: Inputtype,
        });

        response;

        if (response && response.message === "OTP sent successfully.") {
          toast.success("Resend OTP sent successfully.");

          setOTPDetails({
            otp_id: response.otp_id,
          });
        } else {
          toast.success(response.message);
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
              onClick={() => dispatch(activeMobileLoginPages({ login: false }))}
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

                  {otpDetails && otpDetails.otp_id && (
                    <div className="flex flex-row gap-3 w-full">
                      <input
                        type="number"
                        className="p-2 max-w-40 text-gray-300 rounded focus:outline-none bg-black border-b"
                        value={otpDetails.otp}
                        onChange={(e) =>
                          setOTPDetails({ ...otpDetails, otp: e.target.value })
                        }
                      />

                      <button
                        type="button"
                        className="border w-full p-2 rounded-md bg-yellow-600 text-black font-medium hover:bg-yellow-600 transition-all mx-auto"
                        onClick={handleResendOTP}
                      >
                        resend
                      </button>
                    </div>
                  )}

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
  const Merchant_registered = useSelector(
    (state) => state.auth.Merchant_registered
  );
  const { width } = useWindowSize(); // Get the screen width
  const loginPageActive = useSelector((state) => state.auth.loginpageActive);
  const AreaPin = useSelector((state) => state.auth.AreaPin);

  const groupLists = useSelector((state) => state.homeSlice_reducer);


  const userName = useSelector((state) => state.auth.name);

  const MobileNumber = useSelector((state) => state.auth.phone);
  const email = useSelector((state) => state.auth.email);
  const address = useSelector((state) => state.auth.address);

  const [pincodeInfo, setPincodeInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [admin, setAdmin] = useState(false);

  const [pincode, setPincode] = useState(AreaPin);
  const [isValid, setIsValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const { ImportAddress } = useAddressActions();
  const { importDetails } = useImportUserDetails();

  const [isVibrating, setIsVibrating] = useState(false);

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 1000); // Stop vibration after 3 seconds
  };

  async function getLatLongFromPincode(pincode) {
    const apiKey = "2b803d74b243492a860e3659937ab0a4"; // Replace with your actual API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      data;

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
      data;

      if (data[0].Status === "Success") {
        const getLat_Long = await getLatLongFromPincode(pincode);
        getLat_Long;

        if (getLat_Long.latitude && getLat_Long.longitude) {
          getLat_Long;

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
    } finally {
      setLoading(false);
    }

    // setLoading(false);
  };

  useEffect(() => {
    if (AreaPin) {
      dispatch(fetchHomeData(AreaPin)); // where '110001' is the pincode
    }

    // Check if the current path is related to admin/merchant/etc.
    const pathMatch = location.pathname.match(
      /^\/(admin|superadmin|merchant|manager)\//
    );
    const isAdmin = pathMatch !== null;

    // If not an admin, proceed with profile validation and redirection logic
    if (!isAdmin) {
      // Just Remove these three after work!!!!!!!!

      // dispatch(updateAreaPin({ pincode: 827014 }));
      // setIsValid(true);
      // setPincodeInfo("postOffice");

      // Check if the user is registered and if name or mobile number is missing
      if (width >= 1024 && registered && (!userName || !MobileNumber)) {
        // toast.warn("Please fill name, mobile number");
        // navigate("/profile");
        return;
      } else if (width < 1024 && registered && (!userName || !MobileNumber)) {
        // toast.warn("Please fill name, mobile number");
        // navigate("/profile/personal-Information");
        return;
      }

      // Check if the address is missing
      if (width >= 1024 && registered && (!address || address.length === 0)) {
        // toast.warn("Please add a delivery address");
        // navigate("/profile/addresses");
        return;
      } else if (
        width < 1024 &&
        registered &&
        (!address || address.length === 0)
      ) {
        toast.warn("Please add a delivery address");
        navigate("/profile/addresses");
        return;
      }
    } else {
      if (!Merchant_registered) {
        ("Merchant not registered");

        navigate("admin/login");
      }

      ("Admin Route");
      setAdmin(true);
    }
  }, [width, registered, userName, MobileNumber, address, location.pathname]);

  useEffect(() => {
    ("Chala ye wala");

    if (registered) {
      const fun = async () => {
        const response = await getAllCartItems();
        response;

        if (
          response &&
          response.data.message === "Cart items retrieved successfully!"
        ) {
          dispatch(importCartItems(response.data));
        } else {
          // toast.error(response.data.message);
          response;
        }

        ImportAddress();
      };
      fun();
    }
  }, [registered, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await importDetails();
      await ImportAddress();
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;

    setPincode(value);
    if (value.length === 6) {
      value;

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


        if (pincodeResponse?.data?.message === "Available") {
          dispatch(updateAreaPin({ pincode: data.address.postcode }));
          dispatch(
            setLat_Long_Location({ Latitude: latitude, Longitude: longitude })
          );
             (data.address.postcode);
          
          dispatch(fetchHomeData(data.address.postcode)); // where '110001' is the pincode

          setIsValid(true);
          setPincodeInfo(data.address);
          setLoading(false);

               navigate("/");
        } else {
          toast.warn(
            pincodeResponse?.data?.message || pincodeResponse?.data?.error
          );
          setIsValid(false);
          setLoading(false);
          triggerVibration();
        }
      } else {
        toast.warn("Pincode not found or incorrect pincode.");
        setLoading(false);
      }
    } catch (error) {
      alert("An error occurred while fetching location data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      {loginPageActive && <LoginModal />}

      <Suspense fallback={<LoadingModal />}>
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
          <Route path="/page/*" element={<FooterBasePage />} />
          <Route path="/dboy/reset-password" element={<ResetPasswordPage />} />

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
                          <UserMainContent />

                          {/* <Route path="/" element={<LargeScreenHomePage />} /> */}

                          <Routes>
                            <Route
                              path="/Profile/*"
                              element={<UserProfile />}
                            />
                            {/* <Route path="*" element={<NotFound />} /> */}
                            <Route path="product/*" element={<ProductBase />} />

                            <Route path="/Order/*" element={<Orderpanel />} />

                            <Route path="/viewCart/*" element={<ViewCart />} />
                          </Routes>

                          <Footer />
                        </div>
                      </div>
                    ) : (
                      <div className=" ">
                        <Header />
                        <Starting_Page_Base />
                        <Footer />

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
                                value={pincode || ""}
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


                          <Route
                            path="/Categoy"
                            element={<ShopByCategoryBase />}
                          />


                          <Route
                            path="/:grocery"
                            element={<AllSmallProducts />}
                          />


                          <Route
                            path="/grocery/:category"
                            element={<AllSmallProducts />}
                          />


                          <Route
                            path="/grocery/:category/:subCategory"
                            element={<AllSmallProducts />}
                          />


                          <Route
                            path="grocery/:category/:subCategory/:productItem/:item/:VariantId"
                            element={<SingleSmallProduct />}
                          />
                        </Routes>

                        <MobileLoginModal />


                      </div>

                      {/* Footer with relative position */}
                      <FooterBar />
                    </div>
                  )}
                </>
              }
            />
          )}

          {/* <Route path="/viewCart" element={<ViewCart />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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
