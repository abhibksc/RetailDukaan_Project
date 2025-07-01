import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateNumber } from "../ReduxStore/Slices/auth";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import baseurl from "../CrudOperations/customURl";

const NumberVerificationModal = ({otpId ,close,phone, editNumber }) => {
  const [input, setInput] = useState(phone);
  const [otpID, setOtpID] = useState(otpId);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const registered = useSelector((state) => state.auth.registered);

  const handleVerify = async () => {
    if (!input || !otp) {
      toast.error("Both input and OTP are required.");
      return;
    }

    const isPhone = /^[6-9]\d{9}$/.test(input);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    if (!isPhone && !isEmail) {
      toast.error("Please enter a valid email or 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${baseurl}/api/VerifyUserMobileOtp`,
        {
          input,
          otpId: otpID,
          otp,
          type: "phone",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if(response?.data?.message === "Successfully Updated!"){


            dispatch(updateNumber(response.data.number));
      
            toast.success("OTP Verified Successfully!");
      editNumber();
            close();


      }
      

    } catch (error) {
      const msg = error?.response?.data?.message || "Verification failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={close}
        >
          <IoCloseOutline className="text-2xl" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Verify Your Account
        </h2>

        <input
        disabled
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Email or Phone"
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium transition duration-300 ${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default NumberVerificationModal;
