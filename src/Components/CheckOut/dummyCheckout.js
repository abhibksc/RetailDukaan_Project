import React, { useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { activePages, logout } from "../../ReduxStore/Slices/auth";
import { useDispatch, useSelector } from "react-redux";
import NewAddress from "../NewAddress";
import PriceDetails from "../MobileViewCart/Checkout/PriceDetails";
import { LuPlus } from "react-icons/lu";

import Lottie from "react-lottie";
import animationData from "../../../assets/animations/Basket.json";
import ViewBasketModal from "../ViewBasketModal";

const CheckOut = () => {
  const [isLoginChanged, setIsLoginChanged] = useState(false);
  const [selectAddreess, setselectAddreess] = useState(false);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isPaymentChanged, setIsPaymentChanged] = useState(false);
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [viewBasket, setViewBasket] = useState(false);

  const name = useSelector((state) => state.auth?.name || "");
  const phones = useSelector((state) => state.auth.phone);

  console.log(name);
  console.log(phones);

  const [selectAddreesss2, setSelectedAddressss2] = useState("");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const addresses = [
    "123 Main St, Anytown, USA",
    "456 Maple Ave, Anytown, USA",
    "789 Oak Dr, Anytown, USA",
    // Add more addresses as needed
  ];

  const location = useLocation();
  const data = location.state;
  console.log(data);

  useEffect(() => {
    const fun = async () => {
      // const response = await
    };

    fun();
  }, []);

  const handleLoginChange = () => {
    setIsLoginChanged(!isLoginChanged);

    if (!isLoginChanged) {
      setselectAddreess(!selectAddreess);
    } else {
      setselectAddreess(!selectAddreess);
    }

    // setIsOrderChanged(false);
    // setIsPaymentChanged(false);
  };
  const handleAddress = () => {
    setselectAddreess(!selectAddreess);
    // if (!selectAddreess) {
    //   setIsLoginChanged(false);
    //   setIsPaymentChanged(false);
    //   setIsOrderChanged(true);
    // } else {
    //   setIsOrderChanged(true);
    // }
  };
  const handleOrderChange = () => {
    setIsOrderChanged(!isOrderChanged);
    if (!isOrderChanged) {
      setIsPaymentChanged(false);
      setIsLoginChanged(false);
      setselectAddreess(false);
    } else {
      setIsPaymentChanged(true);
    }
  };

  const handlePaymentChange = () => {
    setIsOrderChanged(false);
    setIsPaymentChanged(!isPaymentChanged);
    setIsLoginChanged(false);
    setselectAddreess(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddressChange = (event) => {
    setSelectedAddressss2(event.target.value);
  };
  console.log(selectAddreesss2);

  return (
    <div className="absolute z-40  w-full">
      <nav className="bg-green-600 p-3 pl-40 w-full">
        <h1 className="font-roboto font-semibold text-2xl text-white">
          Grocery
        </h1>
      </nav>

      <div id="" className=" flex justify-center border">
        <div className="p-6 rounded">
          {/* Login */}
          {isLoginChanged ? (
            <div className="bg-white rounded shadow-md mb-4 ">
              <div className="flex gap-2 bg-blue-500 text-white py-3 px-2">
                <span className="border px-1 self-center bg-white text-blue-700 mx-2 rounded-md font-inter font-semibold text-[13px]">
                  1
                </span>
                <span className="font-inter font-semibold">LOGIN</span>
              </div>

              <div className="p-7 ">
                <div>
                  <div className="flex flex-col gap-10">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <span>Name</span>
                            <span>{name}</span>
                          </div>

                          <div>
                            <span>Phone</span>
                            <span>{phones}</span>
                          </div>

                          <div>
                            <span
                              onClick={() => {
                                localStorage.removeItem("token");
                                dispatch(activePages({ login: true }));
                                dispatch(logout());
                                navigate("/");
                              }}
                              className="text-blue-600 cursor-pointer font-semibold text-[13px]"
                            >
                              Logout & Sign in to another account
                            </span>
                          </div>

                          <div>
                            <button
                              onClick={handleLoginChange}
                              className="border w-52 p-3 hover:bg-blue-600 hover:text-white"
                            >
                              <span>Continue Checkout</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div>
                          <span className="text-gray-500">
                            Advantages of our secure login
                          </span>

                          <ul className="mt-4 flex flex-col gap-3 text-[14px]">
                            <li className="flex gap-2 ">
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g fill="none" fillRule="evenodd">
                                  <path
                                    d="M9.466 18.257h4.87c0 1.764 1.42 3.195 3.174 3.195a3.185 3.185 0 0 0 3.175-3.195H22.5c.276 0 .499-.23.499-.496v-5.57l-3.273-4.868h-3.261V4.645a.497.497 0 0 0-.497-.502H1.497A.498.498 0 0 0 1 4.645v13.11c0 .277.219.502.497.502h1.62a3.185 3.185 0 0 0 3.175 3.195 3.185 3.185 0 0 0 3.174-3.195zm6.978-8.381H18.7l2.214 3.057h-4.47V9.876zm2.644 8.381c0 .877-.706 1.588-1.578 1.588a1.583 1.583 0 0 1-1.578-1.588c0-.877.706-1.588 1.578-1.588.872 0 1.578.71 1.578 1.588zm-11.218 0c0 .877-.707 1.588-1.578 1.588a1.583 1.583 0 0 1-1.579-1.588c0-.877.707-1.588 1.579-1.588.871 0 1.578.71 1.578 1.588z"
                                    fill="#2874f0"
                                  ></path>
                                </g>
                              </svg>
                              <span>
                                Easily Track Orders, Hassle free Returns
                              </span>
                            </li>

                            <li className=" flex gap-2 ">
                              <IoMdNotifications className="mt-1" />
                              <span>
                                Get Relevant Alerts and Recommendations
                              </span>
                            </li>

                            <li className="flex gap-3">
                              <span>★</span>
                              <span>Wishlist, Reviews, Ratings and more.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="w-full mx-auto text-center">
                      <span className="text-gray-500 text-[12px]">
                        Please note that upon clicking "Logout" you will lose
                        all items in the cart and will be redirected to the
                        Flipkart home page.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded shadow-md flex flex-row justify-between mb-4">
              <div className="flex gap-3">
                <div>
                  <h1 className="border p-1 h-6 w-5 text-[13px] bg-gray-200 text-blue-500 font-bold">
                    1
                  </h1>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-inter font-semibold text-gray-500">
                    LOGIN
                  </span>
                  <span className="font-inter text-[13px]">
                    <span className="font-semibold">{name}</span> {phones}
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={handleLoginChange}
                  className="border p-3 text-blue-600"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Address section */}
          {selectAddreess ? (
            <div className="flex flex-col w-full">
              <div className="bg-white rounded shadow-md mb-4">
                <div className="flex gap-2 bg-blue-500 text-white py-3 px-2">
                  <span className="border px-1 self-center bg-white text-blue-700 mx-2 rounded-md font-inter font-semibold text-[13px]">
                    2
                  </span>
                  <span className="font-inter font-semibold">
                    DELIVERY ADDRESS
                  </span>
                </div>

                <ul>
                  {addresses.map((address, index) => (
                    <li key={index} className="p-4">
                      <label className="flex gap-4">
                        <input
                          className="self-start mt-1"
                          type="radio"
                          value={address}
                          checked={selectAddreesss2 === address}
                          onChange={handleAddressChange}
                        />
                        <div className="flex flex-col gap-2 text-[14px] w-[400px]">
                          <div className="flex gap-3">
                            <span className="font-semibold font-inter">
                              Abhishek
                            </span>
                            <span className="px-1 text-gray-500 bg-gray-100 font-semibold border">
                              HOME
                            </span>
                            <span className="font-semibold font-inter">
                              992272029
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span>
                              Murti Gali, Near Dislary Pool, lalpur, kokar Rd.,
                              Kokar displary pool
                            </span>
                            <span className="font-semibold">- 842881</span>
                          </div>

                          {selectAddreesss2 === address && (
                            <div>
                              <button
                                onClick={handleAddress}
                                className="border  p-2  bg-green-500 px-10 text-white"
                              >
                                DELIVER HERE
                              </button>
                            </div>
                          )}
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {!isAddressChanged ? (
                <div
                  onClick={() => setIsAddressChanged(true)}
                  className="cursor-pointer bg-white flex gap-4 rounded shadow-md mb-4 p-2 text-blue-500 font-bold"
                >
                  <LuPlus className="mt-1" />
                  <span className="font-inter">Add a new address</span>
                </div>
              ) : (
                <NewAddress props={() => setIsAddressChanged(false)} />
              )}
            </div>
          ) : (
            <div className="bg-white p-4 rounded shadow-md flex flex-row justify-between mb-4 w-full">
              <div className="flex gap-3">
                <div>
                  <h1 className="border p-1 h-6 w-5 text-[13px] bg-gray-200 text-blue-500 font-bold">
                    2
                  </h1>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-inter font-semibold text-gray-500">
                    DELIVERY ADDRESS
                  </span>
                  <span className="font-inter text-[13px]">
                    <span className="font-semibold">Abhishek Kumar</span>, 778,
                    Urban Estate Jind, H No 778, Main Road, Landmark: Near ekta
                    park, 122002, Haryana
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleAddress()}
                  className="border p-3 text-blue-600"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Order summary */}
          {isOrderChanged ? (
            <div>
              <div className="bg-white rounded shadow-md mb-4">
                <div className="flex gap-2 bg-blue-500 text-white py-3 px-2">
                  <span className="border px-1 self-center bg-white text-blue-700 mx-2 rounded-md font-inter font-semibold text-[13px]">
                    3
                  </span>
                  <span className="font-inter font-semibold">
                    ORDER SUMMARY
                  </span>
                </div>

                <div className="flex py-10 justify-around ">
                  <div className="w-72 ">
                    <Lottie options={defaultOptions} height={180} width={140} />
                  </div>

                  <div className="flex flex-col gap-3 py-10 ">
                    <div className="flex gap-2">
                      <span>Grocery Basket(5 items)</span>
                      <span
                        className="font-inter font-semibold text-blue-500 text-[13px] self-center cursor-pointer"
                        onClick={() => setViewBasket(true)}
                      >
                        View Basket
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-inter font-bold ">$3,91</span>
                      <span className="font-inter text-[14px]  line-through">
                        $5,999
                      </span>
                      <span className="text-green-500 text-[14px] font-semibold font-inter">
                        $1,04 saved
                      </span>
                    </div>

                    <div>
                      <button className="border p-2  text-black ">
                        REMOVE BASKET
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row bg-white mb-4 px-3 py-4 justify-around">
                <span className="self-center">
                  {" "}
                  Order Confirmaton email will be sent to{" "}
                  <span className="font-semibold">abhiskak@gmail.com</span>
                </span>

                <button className="bg-green-500 p-3 text-white">
                  CONTINUE
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded shadow-md flex flex-row justify-between mb-4">
              <div className="flex gap-3">
                <div>
                  <h1 className="border p-1 h-6 w-5 text-[13px] bg-gray-200 text-blue-500 font-bold">
                    3
                  </h1>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-inter font-semibold text-gray-500">
                    ORDER SUMMARY
                  </span>
                  <span className="font-inter text-[13px]">
                    <span className="font-semibold">Wheat - 5kg</span>, ₹250
                  </span>
                  <span className="font-inter text-[13px]">
                    <span className="font-semibold">Rice - 10kg</span>, ₹500
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={handleOrderChange}
                  className="border p-3 text-blue-600"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Payment options */}
          {isPaymentChanged ? (
            <div className="bg-white rounded shadow-md mb-4">
              <div className="flex gap-2 bg-blue-500 text-white py-3 px-2">
                <span className="border px-1 self-center bg-white text-blue-700 mx-2 rounded-md font-inter font-semibold text-[13px]">
                  4
                </span>
                <span className="font-inter font-semibold">
                  PAYMENT OPTIONS
                </span>
              </div>

              <div className="p-7 ">
                <div>
                  <div className="flex flex-col gap-10">
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-bold">
                            Credit/Debit Card
                          </span>
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="border p-2"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-bold">UPI</span>
                          <input
                            type="text"
                            placeholder="UPI ID"
                            className="border p-2"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={handlePaymentChange}
                          className="border p-3 text-blue-600"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded shadow-md flex flex-row justify-between mb-4">
              <div className="flex gap-3">
                <div>
                  <h1 className="border p-1 h-6 w-5 text-[13px] bg-gray-200 text-blue-500 font-bold">
                    4
                  </h1>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-inter font-semibold text-gray-500">
                    PAYMENT OPTIONS
                  </span>
                  <span className="font-inter text-[13px]">
                    <span className="font-semibold">Credit/Debit Card</span>,
                    UPI
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={handlePaymentChange}
                  className="border p-3 text-blue-600"
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <PriceDetails />
        </div>
      </div>

      {viewBasket && <ViewBasketModal toggle={() => setViewBasket(false)} />}
    </div>
  );
};

export default CheckOut;
