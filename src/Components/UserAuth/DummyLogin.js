import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activePages, signIn } from "../ReduxStore/Slices/auth";
import {
  SenduserAuthenticationOTP,
  userLogin,
} from "../CrudOperations/PostOperation";
import { Update_LatLongInData_Base } from "../CrudOperations/Update&Edit";
import { toast } from "react-toastify";
import { logo } from "../CrudOperations/customURl";
import FormInput from "./FormInput";

const LoginModal = () => {
  const offersList = [
    {
      id: 1,
      title: "10% Off on First Order",
      description: "Enjoy 10% off on your first order.",
    },
    {
      id: 2,
      title: "Free Delivery",
      description: "Get free delivery for orders above ₹499.",
    },
    {
      id: 3,
      title: "20% Off on Electronics",
      description: "Save 20% on select electronics.",
    },
    {
      id: 4,
      title: "Flat ₹100 Cashback",
      description: "Get ₹100 cashback on prepaid orders.",
    },
    {
      id: 5,
      title: "Buy 1 Get 1 Free",
      description: "Applicable on select grocery items only.",
    },
    {
      id: 6,
      title: "15% Off on Fashion",
      description: "Upgrade your wardrobe with 15% off.",
    },
    {
      id: 7,
      title: "Weekend Special",
      description: "Extra ₹200 off on orders above ₹999 during weekends.",
    },
    {
      id: 8,
      title: "Mobile Accessories Discount",
      description: "Get up to 25% off on mobile accessories.",
    },
    {
      id: 9,
      title: "Festive Sale",
      description: "Celebrate with massive discounts across all categories.",
    },
    {
      id: 10,
      title: "Midnight Flash Deal",
      description: "Exclusive deals available from 12 AM to 2 AM.",
    },
    {
      id: 11,
      title: "Student Discount",
      description: "Extra 5% off for verified students.",
    },
    {
      id: 12,
      title: "Refer & Earn",
      description: "Refer friends and earn ₹50 for each signup.",
    },
  ];

  const [resendLoading, setResendLoading] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState([]);

  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState("text");
  const [otpDetails, setOtpDetails] = useState(null);
  const [otpDone, setOtpDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const Location = useSelector((state) => state.auth.Location);
  const dispatch = useDispatch();

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhone = (value) => /^[6-9]\d{9}$/.test(value);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let type = isEmail(input) ? "email" : isPhone(input) ? "phone" : null;
      if (!type) {
        toast.warn("Invalid Input");
        return;
      }
      setInputType(type);

      if (otpDetails?.otp && otpDetails?.otp_id) {
        const res = await userLogin({
          input,
          type,
          otp: otpDetails.otp,
          otp_id: otpDetails.otp_id,
        });
        if (!res) return;

        if (res.token && res.user) {
          dispatch(
            signIn({
              token: res.token,
              ...res.user,
              userlogin: true,
              registered: true,
              login: false,
              mobile_login_pageActive: false,
            })
          );

          if (Location.Latitude && Location.Longitude) {
            await Update_LatLongInData_Base({
              latitude: Location.Latitude,
              longitude: Location.Longitude,
              id: res.user.id,
            });
          }

          toast.success(res.message);
          setOtpDetails(null);
          setInput("");
          setInputType("");
          setOtpDone(false);
        } else if (res.error?.includes("Invalid OTP")) {
          toast.error("Invalid OTP");
        } else {
          toast.error(res.message || "Something went wrong");
          setOtpDetails(null);
          setInput("");
          setInputType("");
          setOtpDone(false);
        }
      } else if (!otpDone) {
        const response = await SenduserAuthenticationOTP({ input, type });
        if (response?.message.includes("OTP sent")) {
          toast.success(response.message);
          setOtpDetails({ otp_id: response.otp_id });
          setOtpDone(true);
        } else {
          toast.error(response.message || "Failed to send OTP");
        }
      } else {
        toast.warn("Please verify OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!otpDetails?.otp_id || !inputType) return;
    setResendLoading(true);
    try {
      const res = await SenduserAuthenticationOTP({ input, type: inputType });
      if (res?.message.includes("OTP sent")) {
        toast.success("Resend OTP sent successfully.");
        setOtpDetails({ otp_id: res.otp_id });
      } else {
        toast.error(res.message || "Resend failed");
      }
    } catch (error) {
      toast.error("Something went wrong while resending OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/5 backdrop-blur-md z-50">
      <div className="bg-black text-white rounded-xl shadow-xl w-full max-w-2xl animate-[fadeIn_0.7s_ease-out,scaleUp_0.7s_ease-out]">
        <div className="flex rounded-lg shadow-lg bg-black text-white items-stretch">
          <div className="border-r border-gray-600 w-80 px-4 py-4 bg-gradient-to-b from-green-300 to-white text-black">


            {/* Logo Section */}
            <div className="mb-4 flex justify-center">
              <img src={logo} alt="Logo" className="h-12 object-contain" />
            </div>

            {/* Offers Section */}
            <div className="max-h-full">
              {/* Offers Grid */}
              <div
                className="
  overflow-y-auto scrollbar-hide  p-2 max-h-[100px] pr-1 scrollbar-thin scrollbar-thumb-gray-400 grid grid-cols-2 "
              >
                {offersList.map((offer) => (
                  <div
                    key={offer.id}
                    className={`cursor-pointer p-2 border rounded-md transition-all duration-200 ease-in-out ${
                      selectedOffers.includes(offer.id)
                        ? "bg-yellow-100 border-yellow-500 shadow-sm"
                        : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      setSelectedOffers((prev) =>
                        prev.includes(offer.id)
                          ? prev.filter((id) => id !== offer.id)
                          : [...prev, offer.id]
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {offer.title}
                      </span>
                      {selectedOffers.includes(offer.id) && (
                        <span className="text-[10px] bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                          #{selectedOffers.indexOf(offer.id) + 1}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Offer Descriptions */}
              {selectedOffers.length > 0 ? (
                <div className="mt-3 scrollbar-hide  pt-2 border-t border-gray-300  max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 space-y-2">
                  <ul className="space-y-1 text-xs text-gray-700">
                    {selectedOffers.map((id, index) => {
                      const offer = offersList.find((o) => o.id === id);
                      return (
                        <li
                          key={id}
                          className="p-2 bg-white border border-gray-200 rounded shadow-sm"
                        >
                          <div className="font-semibold text-gray-900">
                            {index + 1}. {offer?.title}
                          </div>
                          <div className="text-gray-600">
                            {offer?.description}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="mb-3 bg-yellow-100 border border-yellow-400 text-yellow-900 px-3 py-2 rounded-md shadow-sm text-sm font-medium">
                  🎁 Welcome! Unlock handpicked offers just for you.
                  <span className="block mt-1 text-xs text-yellow-800 font-normal">
                    Select multiple deals, stack your savings & grab your reward
                    surprises!
                  </span>
                </div>
              )}
            </div>

            
          </div>

          <div className="flex-1">
            <form
              className="relative flex flex-col justify-center p-6"
              onSubmit={handleSendOTP}
            >
              <button
                type="button"
                className="absolute top-3 right-4 text-white text-2xl hover:text-gray-400"
                onClick={() => dispatch(activePages({ login: false }))}
              >
                &times;
              </button>
              <h1 className="text-2xl mb-4 text-center font-semibold">
                Login/Signup
                <br />
                <span className="text-sm border-b-2 border-yellow-400 pb-1">
                  Using OTP
                </span>
              </h1>
              <div className="px-6 flex flex-col gap-6 text-center">
                <FormInput
                  id="input"
                  placeholder="Enter Phone Number/Email Id"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 focus:border-yellow-400 focus:ring focus:ring-yellow-300"
                />
                {otpDetails?.otp_id && (
                  <div className="flex gap-3">
                    <input
                      type="number"
                      className="p-2 text-gray-300 rounded bg-black border-b"
                      value={otpDetails.otp || ""}
                      onChange={(e) =>
                        setOtpDetails({ ...otpDetails, otp: e.target.value })
                      }
                    />

                    <button
                      type="button"
                      className={`border p-2 rounded-md bg-yellow-600 text-black hover:bg-yellow-600 flex items-center gap-2 ${
                        resendLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      onClick={handleResendOTP}
                      disabled={resendLoading}
                    >
                      {resendLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
                            />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Resend"
                      )}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`border w-32 p-2 rounded-md bg-yellow-500 text-black hover:bg-yellow-600 mx-auto flex justify-center items-center gap-2 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : otpDetails?.otp_id ? (
                    "Continue"
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <div className="text-xs text-gray-400 leading-tight">
                  By continuing, I accept TCP - retaildukaan
                  <span className="text-yellow-400">
                    {" "}
                    Terms and Conditions{" "}
                  </span>
                  & <span className="text-yellow-400">Privacy Policy</span>.
                  <br />
                  This site is protected by reCAPTCHA and the Google
                  <span className="text-yellow-400"> Privacy Policy </span>&
                  <span className="text-yellow-400"> Terms of Service </span>
                  apply.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
