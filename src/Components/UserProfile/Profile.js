import React, { useEffect, useState } from "react";
import Sidebar from "../Header&SideBar/Sidebar";
import {
  sendMailOTP,
  sendNumberOTP,
  UpdateEmail,
  UpdateName,
  verifyMailOtp,
  verifyNumberOtp,
} from "../CrudOperations/Update&Edit";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  signIn,
  signup,
  updateEmail,
  updateName,
  updateNumber,
} from "../ReduxStore/Slices/auth";
import { GetUserData } from "../CrudOperations/GetOperation";
import Mail_Varification_Modal from "./Mail_Varification_Modal";
import Number_Varification_Modal from "./Number_Varification_Modal.js";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal.js";
import DeactiveModal from "./DeactiveModal.js";

const Profile = () => {
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
  const [mailModal, setMailModal] = useState(false);
  const [numberModal, setNumberModal] = useState(false);
  const [otpId, setOtpId] = useState("");


  const [firstName, setFirstName] = useState(name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(name.split(" ").slice(1).join(" ") || "");
  const [email, setEmail] = useState(emails);
  const [phone, setPhone] = useState(phones);
    const [loading , setLoading] = useState(false);
      const [emailOtp, setEmailOtp] = useState(null);
      const [EmailOtpInput, setEmailOtpInput] = useState(false);

      const [isOpenDeactiveAccountModal, setIsOpenDeactiveAccountModal] = useState(false);


      // setIsOpenDeactiveAccountModal
    
  

 const handleProfileName = async () => {
    setLoading(true)

    console.log("Chala");
    
    
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

        toast.success(response.data.message)
      }
      else{

        toast.success(response.data.message || response.data.error)


      }
    }
    setLoading(false)

  };



  const handleEmail = async () => {
    setLoading(true)


    if (email !== emails) {
      const response = await sendMailOTP({
        mail : email || null,
        registered,
        token,
        id: userId,
      });

      console.log(response);
      

      if (response && response.data.message === "OTP sent successfully") {
        toast.success(response.data.message);
        setEmailOtpInput(true);
      }
      else {
        toast.error(response.data.message || response.data.error)
      }
    } else {
      toast.error("This Email id is already updated!!")
    }

    setLoading(false)

  };

  const handleMobileNumber = async () => {
    if (phone !== phones) {
      // Example code for mobile number update logic
      if (phone.length === 10) {

        console.log(phone);
        console.log(registered);
        console.log(token);
        console.log(userId);
        
        const response = await sendNumberOTP({
          phone,
          registered,
          token,
          id: userId,
        });

        if (response?.data?.message   ===  'OTP sent successfully.') {
          toast.success(response?.data?.message);
          setOtpId(response?.data?.otp_id)

          setNumberModal(true);
        }
        else{
          toast.error(response.data.message || response.data.error)
        }
      } else {
        alert("Enter a valid number or OTP");
      }
    }
  };

   const handleOTP = () => {
      setLoading(true)
  
      if (emailOtp) {
        const fun = async () => {
  
  
          
  
          const response = await verifyMailOtp({
            email: email || null,
            emailOtp: emailOtp,
            registered,
            token,
            id: userId,
          });

          
  
          if (response && response.data.message === "Email verified successfully") {

            console.log(response);
            dispatch(updateEmail(response.data.email));
            toast.success("Successfully verified");
            setEmailOtp(null);

            setEmailOtpInput(false);
            setEditEmail(false);

          }
          else{
  
            toast.error(response.data.message || response.data.error)
  
          }
        };
  
        fun();
      }
      else{
        toast.warn("Email Otp is Empty!!!")
      }
  
      setLoading(false)
  
    };

    // if(loading) return <div className="min-h-screen min-w-full"> <LoadingModal/> </div>
  

  return (
    <div className="flex gap-4 mt-14 xl:mt-0 justify-center">
      {/* <Sidebar /> */}
      {numberModal && (
        <Number_Varification_Modal otpId={otpId} close={() => setNumberModal(false)} phone={phone}  editNumber ={()=>setEditNumber(false)}/>
      )}

      <div className="bg-white flex flex-col gap-4 border p-4 w-[1100px]">

        { loading &&

           <div className="fixed inset-0 flex items-center justify-center  bg-opacity-30 z-50">
      <div className=" p-6 rounded-lg shadow-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    </div>
        }
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

          <div className="flex flex-row gap-4">
            

               <div className="flex flex-row gap-4">
                <input
                    onChange={(e) => setFirstName(e.target.value)}
                disabled={!editName}
                  value={firstName}
                  className={`${editName ? "bg-gray-200 text-black"  : "bg-gray-200 text-gray-500 cursor-not-allowed"}        rounded-sm w-48 px-3 py-2 `}
                  type="text"
                />
                <input
                  onChange={(e) => setLastName(e.target.value)}
                          disabled={!editName}
                  value={lastName}
  className={`${editName ? "bg-gray-200 text-black"  : "bg-gray-200 text-gray-500 cursor-not-allowed"}        rounded-sm w-48 px-3 py-2 `}
                  type="text"
                />
              </div>

              {editName &&

                  <button
                  className="border w-28 p-2 bg-blue-400 hover:bg-blue-600"
                  onClick={handleProfileName}
                >
                  ADD
                </button>

              }


            
            
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="flex gap-4">
            <h1 className="font-bold font-roboto">Email</h1>
            <span
              onClick={() => setEditEmail(!editEmail)}
              className="cursor-pointer text-blue-600 font-semibold font-roboto"
            >
              Edit
            </span>
          </div>

          <div className="flex flex-row gap-4">
            {editEmail ? (
              <div className="flex gap-3">
                <input
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-200 rounded-sm w-48 px-3 py-2"
                  type="email"
                />
                <button
                  className="border w-28 p-2 bg-blue-400 hover:bg-blue-600"
                  onClick={handleEmail}
                >
                  ADD
                </button>
              </div>
            ) : (
              <input
                value={email || ""}
                placeholder={email || "Email"}
                className="bg-gray-200 text-gray-400 rounded-sm w-48 px-3 py-2 cursor-not-allowed"
                type="email"
                readOnly
              />
            )}
          </div>


          {EmailOtpInput   && <div className="flex gap-3">
          
          <input type="text" placeholder="Enter Otp"    value={emailOtp}  onChange={(e)=>setEmailOtp(e.target.value)}  className="bg-gray-200 rounded-sm w-48 px-3 py-2"/>
          <button className="border w-28 p-2 bg-blue-400 hover:bg-blue-600"
                  onClick={handleOTP}>
            Verify
          </button>
          </div>}


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
              <div className="flex gap-4">
                <input
                  value={phone || ""}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-200 rounded-sm w-48 px-3 py-2"
                  type="text"
                />
                <button
                  className="border w-28 p-2 bg-blue-400 hover:bg-blue-600"
                  onClick={handleMobileNumber}
                >
                  Save
                </button>
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
        </div>


         {/* FAQs */}
         <div className="flex flex-col gap-5 ">
          <h1 className="text-lg font-semibold">FAQs</h1>
          <p className="text-md font-semibold text-gray-800">What happens when I update my email address (or mobile number)?</p>
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

        {/* Deactivate Account */}
        <div className="font-bold text-blue-600 mt-10 font-roboto cursor-pointer" onClick={()=>setIsOpenDeactiveAccountModal(true)}>
          Deactivate Account
        </div>

        <div className="text-red-600 font-roboto font-bold">Delete Account</div>


{
isOpenDeactiveAccountModal &&

<DeactiveModal isOpen={()=>setIsOpenDeactiveAccountModal(!isOpenDeactiveAccountModal)} onClose={()=>setIsOpenDeactiveAccountModal(!isOpenDeactiveAccountModal)}/>

}



    

      </div>
    </div>
  );
};

export default Profile;
