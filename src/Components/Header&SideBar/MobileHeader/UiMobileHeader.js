import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// import logo from "../../../assets/Logo/retail_dukaan_images.png";
import { Mobilemenu } from "../../ReduxStore/Slices/toggleSlice";
import { activeMobileLoginPages, signIn } from "../../ReduxStore/Slices/auth";
import { FaRegUserCircle } from "react-icons/fa";
import { Update_LatLongInData_Base } from "../../CrudOperations/Update&Edit";
import {
  SenduserAuthenticationOTP,
  userLogin,
} from "../../CrudOperations/PostOperation";
import { toast } from "react-toastify";
import useTruncateSentance from "../../UseFullHooks/useTruncateSentance";
import { logo } from "../../CrudOperations/customURl";

const UiMobileHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setinput] = useState("");
  const [otpDetails, setOTPDetails] = useState(null);
  const Customer_name = useSelector((state) => state.auth.name);
  const registered = useSelector((state) => state.auth.registered);

  //  registered

  const { truncateText } = useTruncateSentance();

  const mobile_login_pageActive = useSelector(
    (state) => state.auth.mobile_login_pageActive
  );

  useEffect(() => {
    if (mobile_login_pageActive) {
      document.body.classList.add("modal-open");
      return () => {
        document.body.classList.remove("modal-open");
      };
    }
  }, [mobile_login_pageActive, dispatch]);

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
      type = "phone";
    } else {
      toast.warn("Invalid Input");
    }

    try {
      if (MyInput) {
        if (otpDetails) {
          const response = await userLogin({
            input: input,
            type: type,
            otp: otpDetails.otp,
            otp_id: otpDetails.otp_id,
          });

          console.log(response);

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

            if (Location.Latitude && Location.Longitude && response.user.id) {
              const updateInDataBase = await Update_LatLongInData_Base({
                latitude: Location.Latitude,
                longitude: Location.Longitude,
                id: response.user.id,
              });
              console.log(updateInDataBase);
            }

            toast.success(response.message);

            setOTPDetails(null);
          } else if (
            response &&
            response.message === "Registration successful."
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
              console.log(updateInDataBase);
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
              console.log(updateInDataBase);
            }

            toast.success(response.message);

            setOTPDetails(null);
          } else {
            toast.error(response.message);
            setOTPDetails(null);
            setinput("");
          }
        } else {
          // const response = await userLogin({ input : input , type : type });

          const response = await SenduserAuthenticationOTP({
            input: input,
            type: type,
          });

          console.log(response);

          if (response && response.message === "OTP sent successfully.") {
            toast.success(response.message);

            setOTPDetails({
              otp: response.otp,
              otp_id: response.otp_id,
            });
          } else {
            toast.success(response.message);
          }
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

  const hangleProfileIcon = () => {
    if (!registered) {
      dispatch(activeMobileLoginPages({ login: true }));
    } else {
      navigate("/Profile");
    }
  };

  return (
    <header className="fixed z-40 w-full h-16 bg-gradient-to-b from-green-400 to-white shadow-md shadow-green-200">
      <div className="flex items-center justify-between px-5 xl:px-10 h-full">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            dispatch(Mobilemenu({ mobileMenuToggle: false }));
            navigate("/");
            window.location.reload();
          }}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-12 sm:w-14 xl:w-20 h-auto transition-transform hover:scale-105"
          />
        </div>



        <div className="flex gap-5">
          <div className="mt-1 font-bold">
            {Customer_name && truncateText(Customer_name, 1)}
          </div>

          {/* User Icon */}
          <FaRegUserCircle
            className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 hover:text-green-600 cursor-pointer transition-colors"
            onClick={hangleProfileIcon}
          />
        </div>

      </div>
    </header>
  );
};

export default UiMobileHeader;
