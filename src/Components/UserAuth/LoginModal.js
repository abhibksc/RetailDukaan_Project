import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  activePages,
  registered,
  signIn,
  signup,
} from "../ReduxStore/Slices/auth";
import { json, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { SenduserAuthenticationOTP, userLogin, userRegister } from "../CrudOperations/PostOperation";
import { getAllCartItems, GetUserData } from "../CrudOperations/GetOperation";
import { importCartItems } from "../ReduxStore/Slices/cartSlice";

import retailLogo from "../../assets/Logo/retail_dukaan_images.png";

import { toast } from "react-toastify";
import { Update_LatLongInData_Base } from "../CrudOperations/Update&Edit";
import { logo } from "../CrudOperations/customURl";

Modal.setAppElement("#root");

const LoginModal = () => {

  
  const [input, setinput] = useState("");
  const [Inputtype, setInputtype] = useState("text");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

   const Location = useSelector((state) => state.auth.Location);
   const Customer_userId = useSelector((state) => state.auth.Customer_userId);



  
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [otpDetails,setOTPDetails] = useState(null);
  const [otpDone,setOtpDone] = useState(null);

  const login = useSelector((ele) => ele.auth.loginpageActive);
  console.log(login);

  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(activePages({ login: false }));
    setModalIsOpen(!modalIsOpen);
  };

  const toggleSignup = () => setIsSignup(!isSignup);


  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);







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

          else if(response && response.error === "Invalid OTP."){
            console.log(response);
            

            return toast.error("Invalid Otp");

          }
          else if(response && response.error && response.error.otp.length > 0 && response.error.otp[0] === "The selected otp is invalid."){

            return toast.error("Invalid Otp");

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
    

  };

  // handleResendOTP


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
    <>
      {(
        <div
          className="fixed inset-0 flex items-center justify-center bg-white/5 backdrop-blur-md z-50 transition-opacity duration-300 ease-out opacity-100"
        >
          <div className="bg-black text-white rounded-xl shadow-xl w-full max-w-2xl  transform scale-95 animate-[fadeIn_0.7s_ease-out,scaleUp_0.7s_ease-out]">
          <div className="flex  rounded-lg shadow-lg shadow-gray-900 w-full bg-black text-white items-stretch h-full">
  <div className="border-r border-gray-600 px-6 flex items-center bg-gradient-to-b from-green-300 to-white ">
    <img src={logo} alt="Retail Logo" className="w-40 mx-10" />
  </div>

              <div className="flex-1">
                <form
                  className="relative flex flex-col justify-center p-6"
                  onSubmit={handleSendOTP}
                >
                  <button
                    type="button"
                    className="absolute top-3 right-4 text-white text-2xl hover:text-gray-400 transition-all"
                    onClick={()=>     dispatch(activePages({ login: false }))}
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
                      value={input || ""}
                      onChange={(e) => setinput(e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 focus:border-yellow-400 focus:ring focus:ring-yellow-300"
                    />
                    {
                      otpDetails && otpDetails.otp_id && <div className="flex flex-row gap-3">

                      <input type="number" 
                        className="p-2 max-w- text-gray-300 rounded focus:outline-none bg-black border-b"
                        value={otpDetails.otp}
                        onChange={(e) => setOTPDetails({...otpDetails,otp : e.target.value})}
                        />

                        <button type="button" className="border p-2 rounded-md bg-yellow-600 text-black font-medium hover:bg-yellow-600 transition-all mx-auto" onClick={handleResendOTP}>
                          resend
                        </button>



                      </div>
                    }
                    <button
                      type="submit"
                      className="border w-32 p-2 rounded-md bg-yellow-500 text-black font-medium hover:bg-yellow-600 transition-all mx-auto"
                    >
                      { otpDetails && otpDetails.otp_id ?  "Continue" : "Verify Otp"}
                    </button>
                    <div className="text-xs text-gray-400 leading-tight">
                      By continuing, I accept TCP - retaildukaan{" "}
                      <span className="text-yellow-400">
                        Terms and Conditions
                      </span>{" "}
                      & <span className="text-yellow-400">Privacy Policy</span>.{" "}
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
        </div>
      )}
    </>
  );
};

const LoginForm = ({ toggleSignup, close }) => {
  const [input, setinput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();
    // try {
    //   if (input && password) {
    //     const response = await userLogin({ mail: input, pass: password });
    //     if (response) {
    //       console.log(response);

    //       const token = localStorage.getItem("token");

    //       console.log(token);

    //       dispatch(
    //         signIn({
    //           token: token,
    //           input: response.input,
    //           name: response.name,
    //           phone: response.phone,
    //           userId: response.id,
    //           userlogin: true,
    //         })
    //       );
    //       dispatch(registered(true));
    //       close();
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error logging in:", error);
    // }

    toast.warn("I appreciate your patience.");
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div className="flex p-6 rounded-lg shadow-lg shadow-gray-900 w-full bg-black text-white items-center">
      <div className="border-r border-gray-600 px-6 flex items-center">
        <img src={logo} alt="Retail Logo" className="w-60" />
      </div>

      <div className="flex-1">
        <form
          className="relative flex flex-col justify-center p-6"
          onSubmit={handleForm}
        >
          <button
            type="button"
            className="absolute top-3 right-4 text-white text-2xl hover:text-gray-400 transition-all"
            onClick={close}
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
              placeholder="input"
              type="input"
              value={input}
              onChange={(e) => setinput(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 focus:border-yellow-400 focus:ring focus:ring-yellow-300"
            />
            <button
              type="submit"
              className="border w-32 p-2 rounded-md bg-yellow-500 text-black font-medium hover:bg-yellow-600 transition-all mx-auto"
            >
              Continue
            </button>
            <div className="text-xs text-gray-400 leading-tight">
              By continuing, I accept TCP - bigbasket’s{" "}
              <span className="text-yellow-400">Terms and Conditions</span> &{" "}
              <span className="text-yellow-400">Privacy Policy</span>. <br />
              This site is protected by reCAPTCHA and the Google{" "}
              <span className="text-yellow-400">Privacy Policy</span> &{" "}
              <span className="text-yellow-400">Terms of Service</span> apply.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const SignupForm = ({ toggleSignup, close }) => {
  const [input, setinput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (input && password && confirmPassword) {
        if (password !== confirmPassword) {
          alert("Confirm password not matching");
        } else {
          const response = await userRegister({ mail: input, pass: password });
          console.log(response);

          if (response) {
            console.log(response);

            const userData = await GetUserData();
            console.log(userData);

            const tokenData = localStorage.getItem("token");
            console.log(typeof tokenData);

            console.log(tokenData);

            dispatch(
              signup({
                token: tokenData,
                input: userData.data.input,
                name: userData.data.name,
                phone: userData.data.phone,
                userId: userData.data.userId,
              })
            );
            dispatch(registered(true));

            const fetchCartItems = async () => {
              const responsess = await getAllCartItems();
              console.log(responsess);

              if (responsess && responsess.data.data.length > 0) {
                dispatch(importCartItems(responsess.data));
              }
            };

            fetchCartItems();

            navigate("/profile");
            close();
          }
        }
      } else {
        alert("Please fill all fields!");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <form
      className="rounded-md shadow-lg font-roboto border w-80 bg-black text-white flex flex-col justify-around gap-7 relative"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="absolute top-2 right-2 text-black"
        onClick={close}
      >
        &times;
      </button>
      <h1 className="text-2xl p-2 bg-white text-center font-bold mb-5 text-black">
        Create Account
      </h1>
      <div className="mx-auto flex flex-col gap-8 text-center">
        <FormInput
          id="input"
          placeholder="input"
          type="input"
          value={input}
          onChange={(e) => setinput(e.target.value.toLowerCase())}
        />
        <FormInput
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormInput
          id="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex justify-between flex-col gap-3">
          <button
            type="submit"
            className="border w-28 p-1 rounded-md hover:text-blue-500 mx-auto"
          >
            Signup
          </button>
          <button
            type="button"
            className="p-4 mx-auto hover:text-blue-400"
            onClick={toggleSignup}
          >
            Already have an account? Login here.
          </button>
        </div>
      </div>
    </form>
  );
};

const FormInput = ({
  id,
  placeholder,
  type,
  value,
  onChange,
  toggleShowPassword,
  showPassword,
}) => (
  <div className="flex flex-col gap-3 relative">
    <input
      id={id}
      placeholder={placeholder}
      className="p-2 max-w- text-gray-300 rounded focus:outline-none bg-black border-b"
      type={type}
      value={value}
      onChange={onChange}
      required
    />

    {toggleShowPassword && (
      <button
        type="button"
        className="absolute right-2 top-2 text-gray-300"
        onClick={toggleShowPassword}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    )}
  </div>
);

export default LoginModal;
