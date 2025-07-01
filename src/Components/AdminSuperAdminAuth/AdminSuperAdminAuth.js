import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/superadmin.json";
import {
  superAdminLogin,
  Verify_admin_superadminLogin__otp,
} from "../CrudOperations/PostOperation";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAdministrator } from "../ReduxStore/Slices/auth";
import axios from "axios";
import baseurl from "../CrudOperations/customURl";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";

const AdminSuperAdminAuth = () => {
  const [authMethod, setAuthMethod] = useState("email");
  const [userType, setUserType] = useState("SuperAdmin"); // Default user type
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchUserRoles = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/roles`);
        if (response.data) {
          setUserRoles(response.data); // Store all roles
        }
      } catch (error) {
        toast.error("Error fetching user roles" ,error);
      }

      setLoading(false);
    };
    fetchUserRoles();
  }, []);


  const handleAuthMethodChange = (e) => {
    setAuthMethod(e.target.value);
    setInputValue("");
    setOtpSent(false);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    navigate(`/${e.target.value}/login`);
  };

  const handleSubmit = async (e) => {
    // setLoading(true);
    console.log("Chalaaa");
    e.preventDefault();
    if (otpSent && otp) {
      const response = await Verify_admin_superadminLogin__otp({
        authMethod,
        userType,
        otp,
        inputValue,
      });
      console.log(response);
      if (response.message === "merchant Login successful") {
        toast.success(response.message);

        //
        const merchant = localStorage.getItem("Merchanttoken");

        dispatch(
          updateAdministrator({
            role: response.user.role,
            id: response.user.id,
            Merchant_registered: true,
          })
        );
        // dispatch(updateToken("Merchanttoken"));
        navigate(`/admin/${merchant}/dashboard`);
      } else if (response.message === "SuperAdmin Login successful") {
        const superadmintoken = localStorage.getItem("superadmintoken");

        // dispatch(updateToken("superadmintoken"));
        navigate(`/superadmin/${superadmintoken}`);
      } else if (response == undefined) {
    setLoading(false);

        console.log("locha hai response undefined bata raha...");
      }

    setLoading(false);

    } else {
      const response = await superAdminLogin({
        authMethod,
        userType,
        inputValue,
      });
      console.log(response);
      if (response && response.message === "OTP sent successfully") {
        toast.success(response.message);
        setOtpSent(true);
      }
      else{
        toast.error(response.message);
    setLoading(false);

      }
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 via-green-300 to-green-500">
      {loading && <LoadingModal />}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative overflow-hidden">
        <Lottie
          animationData={animationData}
          loop={true}
          className="absolute top-0 left-0 w-full h-full opacity-30"
        />
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
            Administrator
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Sign in using:
            </label>
            <select
              value={authMethod}
              onChange={handleAuthMethodChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="phone">Mobile Number</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              User Type:
            </label>
            <select
              value={userType || ""}
              onChange={handleUserTypeChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option key="SuperAdmin" value="superadmin">
                SuperAdmin
              </option>
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                {authMethod === "email" ? "Email" : "Mobile Number"}:
              </label>
              <input
                type={authMethod === "email" ? "email" : "tel"}
                value={inputValue || ""}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {otpSent && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">OTP:</label>
                <input
                  type="number"
                  value={otp || ""}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full p-3 mt-4 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {otpSent ? "Verify OTP" : "Send OTP"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {otpSent
                ? "Enter the OTP sent to your email/phone"
                : "OTP will be sent to your email/phone"}
            </p>
            <p className="text-gray-600 mt-2">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSuperAdminAuth;
