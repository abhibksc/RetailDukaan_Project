import React, { useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { useSelector } from "react-redux";
import useWindowSize from "../useWindowSize";

const CheckOutLogin = ({ handleLoginChange }) => {
  const { width } = useWindowSize(); // Get the screen width

  const [isLoginChanged, setisLoginChanged] = useState(false);
  const phones = useSelector((state) => state.auth.phone);
  const registered = useSelector((state) => state.auth.registered);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const name = useSelector((state) => state.auth?.name || "");

  return (
    <>
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
                      <div className="flex gap-2 items-center">
                        <span>Name</span> :
                        <span>{name}</span>
                      </div>

                      <div>
                        <span>Phone</span> :
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
                          onClick={() => setisLoginChanged(!isLoginChanged)}
                          className="border w-52 p-3 hover:bg-blue-600 hover:text-white"
                        >
                          <span>Continue Checkout</span>
                        </button>
                      </div>
                    </div>
                  </div>

             {width >= 1024   &&  <div>
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
                          <span>Easily Track Orders, Hassle free Returns</span>
                        </li>

                        <li className=" flex gap-2 ">
                          <IoMdNotifications className="mt-1" />
                          <span>Get Relevant Alerts and Recommendations</span>
                        </li>

                        <li className="flex gap-3">
                          <span>★</span>
                          <span>Wishlist, Reviews, Ratings and more.</span>
                        </li>
                      </ul>
                    </div>
                  </div>}
                </div>

                <div className="w-full mx-auto text-center">
                  <span className="text-gray-500 text-[12px]">
                    Please note that upon clicking "Logout" you will lose all
                    items in the cart and will be redirected to the Flipkart
                    home page.
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
              <h1 className="border p-1 h-6 w-5 text-[13px] bg-gray-200 text-blue-500 font-bold text-center">
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

          <div className="ml-auto flex items-center">
            <button
              className="border px-2 text-blue-600"
              // Uncomment and add handler function if needed
              onClick={() => setisLoginChanged(!isLoginChanged)}
            >
              Change
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckOutLogin;
