import React, { useEffect, useState } from "react";
import Number_Varification_Modal from "../UserProfile/Number_Varification_Modal";
import Mail_Varification_Modal from "../UserProfile/Mail_Varification_Modal";
import { GetUserData } from "../CrudOperations/GetOperation";
import Sidebar from "../Header&SideBar/Sidebar";
import {
  logout,
  signIn,
  signup,
  updateEmail,
  updateName,
  updateNumber,
} from "../ReduxStore/Slices/auth";
import {
  sendMailOTP,
  sendNumberOTP,
  UpdateName,
  verifyMailOtp,
  verifyNumberOtp,
  verifyPhoneOtp,
} from "../CrudOperations/Update&Edit";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";

// import Sidebar from "../Header&SideBar/Sidebar.js";
// import {
//   sendMailOTP,
//   sendNumberOTP,
//   UpdateEmail,
//   UpdateName,
//   verifyNumberOtp,
// } from "../CrudOperations/Update&Edit.js";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   logout,
//   signIn,
//   signup,
//   updateName,
//   updateNumber,
// } from "../ReduxStore/Slices/auth.js";
// import { GetUserData } from "../CrudOperations/GetOperation.js";
// import Mail_Varification_Modal from "./Mail_Varification_Modal.js";
// import Number_Varification_Modal from "./Number_Varification_Modal.js";

const SProfile = () => {
  const emails = useSelector((state) => state.auth.email);
  const phones = useSelector((state) => state.auth.phone);
  const registered = useSelector((state) => state.auth.registered);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const name = useSelector((state) => state.auth?.name || "");
  console.log(name);

  const dispatch = useDispatch();

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editNumber, setEditNumber] = useState(false);

  // Modal
  const [EmailOtpInput, setEmailOtpInput] = useState(false);
  const [emailOtp, setEmailOtp] = useState(null);

  const [phoneOtp, setPhoneOtp] = useState(null);

  // emailOtp
  const [numberModal, setNumberModal] = useState(null);

  const [firstName, setFirstName] = useState(name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(
    name.split(" ").slice(1).join(" ") || ""
  );
  const [email, setEmail] = useState(emails);
  const [phone, setPhone] = useState(phones);
  const [loading, setLoading] = useState(false);

  const handleProfileName = async () => {
    setLoading(true);

    if (firstName && lastName) {
      const response = await UpdateName({
        name: `${firstName} ${lastName}`,
        registered,
        token,
        id: userId,
      });

      if (response && response.data.message === "User updated successfully") {
        dispatch(updateName(response.data.updatedFields.name));

        setEditName(false);

        toast.success(response.data.message);
      } else {
        toast.success(response.data.message || response.data.error);
      }
    }
    setLoading(false);
  };

  const handleEmail = async () => {
    setLoading(true);
    console.log("email running");

    if (email !== emails) {
      const response = await sendMailOTP({
        mail: email,
        registered,
        token,
        id: userId,
      });

      console.log(response);

      if (response && response.data.message === "OTP sent successfully") {
        toast.success(response.data.message);
        setEmailOtpInput(true);
      } else {
        toast.error(response.data.message || response.data.error);
      }
    } else {
      toast.error("This Email id is already updated!!");
    }

    setLoading(false);
  };

  const handleMobileNumber = async () => {
    setLoading(true);

    if (phone !== phones) {
      // Example code for mobile number update logic
      if (phone.length === 10) {
        const response = await sendNumberOTP({
          input : phone,
          type : "phone",
          registered,
          token,
          id: userId,
        });

        console.log(response);
        

        if (response && response.data.message === "OTP sent successfully.") {
          setEmailOtp(null);
          setNumberModal(response.data);
           toast.success(response.data.message)

        } else if (response && response.data.error) {

          toast.error(response.data.error);


        }
      } else {
        alert("Enter a valid number or OTP");
      }
    }

    setLoading(false);
  };

  const handleOTP = () => {
    setLoading(true);

    if (emailOtp) {
      const fun = async () => {
        const response = await verifyMailOtp({
          email: email,
          emailOtp: emailOtp,
          registered,
          token,
          id: userId,
        });

        if (
          response &&
          response.data.message === "Email verified successfully"
        ) {
          console.log(response);
          dispatch(updateEmail(response.data.email));
          toast.success("Successfully verified");
          setEmailOtp(null);
          setEditEmail(false)
          setEmailOtpInput(false)

        } else {
          toast.error(response.data.message || response.data.error);
        }
      };

      fun();
    } else if (numberModal && phoneOtp && phone) {










      const fun = async () => {
        const response = await verifyPhoneOtp({
          input : phone,
          type : "phone",
          otpId: numberModal.otp_id,
          otp: phoneOtp,
          registered,
          token,
          id: userId,
        });

        console.log(response);
        

        if (
          response &&
          response.data.message === "Successfully Updated!"
        ) {
          console.log(response);


          dispatch(updateNumber(response.data.phone));
          setEmailOtp(null);
          setPhoneOtp(null)
          setNumberModal(null)
          setEditNumber(false)
          toast.success(response.data.message);
          
        } else if (response && response.data.error) {

          toast.error(response.data.error);


        }
      };

      fun();
    }
    else{
      toast.error("Frontend Error !!!!!")
    }

    setLoading(false);
  };

  if (loading)
    return (
      <div className="w-screen h-screen">
        {" "}
        <LoadingModal />{" "}
      </div>
    );

  return (
    <div className="flex gap-4 mt-16  xl:mt-0 justify-center ">

      <div className="bg-white flex flex-col  p-4 ">
        {/* Personal Information */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="flex gap-4">
            <h1 className="font-bold font-roboto">Personal Information</h1>
            <span
              onClick={() => setEditName(!editName)}
              className="cursor-pointer text-blue-600 font-semibold font-roboto"
            >
              Edit
            </span>
          </div>

          <div className="flex flex-row gap-4 ">
            {editName ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col  gap-4">
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    placeholder="First Name"
                    className="bg-gray-200 rounded-sm px-3 py-1 "
                    type="text"
                  />
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    placeholder="Last Name"
                    className="bg-gray-200 rounded-sm   px-3 py-1"
                    type="text"
                  />
                </div>
                <button
                  className="border w-2/6 p-1  bg-blue-400 hover:bg-blue-600"
                  onClick={handleProfileName}
                >
                  ADD
                </button>
              </div>
            ) : (
              <div className="flex flex-col  gap-4">
                <input
                  placeholder={firstName}
                  className="bg-gray-200 text-gray-400 rounded-sm p-1 px-3 cursor-not-allowed"
                  readOnly
                  type="text"
                />
                <input
                  placeholder={lastName}
                  className="bg-gray-200 text-gray-400 rounded-sm p-1 px-3  cursor-not-allowed"
                  readOnly
                  type="text"
                />
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="flex gap-4">
            <h1 className="font-bold font-roboto">Email</h1>
            <span
              onClick={() => {setEditEmail(!editEmail) 
                // setEmailOtpInput(!EmailOtpInput)
                setEmailOtp(null)
                setEmailOtpInput(false)
                setEmail(emails)
              }}
              className="cursor-pointer text-blue-600 font-semibold font-roboto"
            >
              Edit
            </span>
          </div>

          <div className="flex flex-col  gap-4">
            {editEmail  ? (
              <div className="flex flex-col  gap-3">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-200 rounded-sm w-48 px-3 py-2"
                  type="email"
                />
              {!EmailOtpInput &&  <button
                  className="border w-20 bg-blue-400 hover:bg-blue-600"
                  onClick={handleEmail}
                >
                  Send Otp
                </button>}
              </div>
            ) : (
              <input
                value={email}
                placeholder={email}
                className="bg-gray-200 text-gray-400 rounded-sm w-48 px-3 py-2 cursor-not-allowed"
                type="email"
                readOnly
              />
            )}
          </div>

          {EmailOtpInput && (
            <div className="flex flex-col  gap-3">
              <input
                type="text"
                placeholder="Enter Otp"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                className="bg-gray-200 rounded-sm w-48 px-3 py-2"
              />
              <button
                className="border w-20 p-1 bg-blue-400 hover:bg-blue-600"
                onClick={handleOTP}
              >
                Verify
              </button>
            </div>
          )}
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="flex gap-4">
            <h1 className="font-bold font-roboto">Mobile Number</h1>
            <span
              onClick={() => setEditNumber(!editNumber)}
              className="text-blue-600 font-semibold font-roboto cursor-pointer"
            >
              Edit
            </span>
          </div>
          <div className="flex flex-row gap-4">
            {editNumber ? (
              <div className="flex flex-col gap-4">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-200 rounded-sm w-48 px-3 py-2"
                  type="text"
                />
                {!numberModal && <button
                  className="border w-24 py-1 bg-blue-400 hover:bg-blue-600"
                  onClick={handleMobileNumber}
                >
                  Send Otp
                </button>}
              </div>
            ) : (
              <input
                placeholder={phone}
                className="bg-gray-200 text-gray-400 rounded-sm w-48 px-3 py-2 cursor-not-allowed"
                readOnly
                type="text"
              />
            )}
          </div>


          {numberModal  && (
            <div className="flex flex-col  gap-3">
              <input
                type="text"
                placeholder="Enter Otp"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                className="bg-gray-200 rounded-sm w-48 px-3 py-2"
              />
              <button
                className="border w-28 p-2 bg-blue-400 hover:bg-blue-600"
                onClick={handleOTP}
              >
                Verify
              </button>
            </div>
          )}


        </div>

        {/* FAQs */}
        <div className="flex flex-col gap-5 ">
          <h1 className="text-lg font-semibold">FAQs</h1>
          <p className="text-md font-semibold text-gray-800">
            What happens when I update my email address (or mobile number)?
          </p>
          <p className="text-sm">
            Your login email id (or mobile number) changes, likewise. You'll
            receive all your account related communication on your updated email
            address (or mobile number).
          </p>
          <p className="text-md font-semibold text-gray-800">
            When will my account be updated with the new email address (or
            mobile number)?
          </p>
          <p className="text-sm">
            It happens as soon as you confirm the verification code sent to your
            email (or mobile) and save the changes.
          </p>
          <p className="text-md font-semibold text-gray-800">
            What happens to my existing account when I update my email address
            (or mobile number)?
          </p>
          <p className="text-sm">
            Updating your email address (or mobile number) doesn't invalidate
            your account. Your account remains fully functional. You'll continue
            seeing your order history, saved information, and personal details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SProfile;
