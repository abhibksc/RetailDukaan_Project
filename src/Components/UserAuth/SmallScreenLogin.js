import React, { useState } from "react";

const SmallScreenLogin = ({ isOpen, onClose }) => {
  const [loginType, setLoginType] = useState("phone"); // Default login type

  console.log("Chala");
  

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-50 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-end`}
    >
      <div className="w-full bg-white rounded-t-lg p-6 shadow-lg transition-transform transform duration-300 ease-in-out">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-4">
          Login or Sign Up
        </h2>

        {/* Toggle Login Type */}
        <div className="flex justify-center space-x-6 mb-6">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              loginType === "phone"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setLoginType("phone")}
          >
            Login with Phone
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              loginType === "email"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setLoginType("email")}
          >
            Login with Email
          </button>
        </div>

        {/* Input Fields */}
        <form>
          {loginType === "phone" && (
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                placeholder="Enter your phone number"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          {loginType === "email" && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          By continuing, you agree to Flipkart's{" "}
          <span className="text-blue-500">Terms of Use</span> and{" "}
          <span className="text-blue-500">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};


export default SmallScreenLogin;
