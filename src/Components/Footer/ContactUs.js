import React from "react";
import logo from '../../assets/Logo/retail_dukaan_images.png';
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <div className=" px-5">
      <div className="max-w-6xl mx-auto bg-white p-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Section */}
          <div className="p-8 bg-gradient-to-b from-blue-500 to-purple-600 text-white">
            <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
            <p className="text-lg leading-relaxed mb-6">
              Feel free to reach out for any inquiries or support. We're here to
              help!
            </p>
            <div className="space-y-4">
              <p>
                <span className="font-bold">Phone:</span> +91 9942324747
                <br />
                <span className="text-sm">Operational 6 days, 9 AM to 6 PM</span>
              </p>
              <p>
                <span className="font-bold">Email:</span> info@retaildukaan.com
              </p>
              <p>
                <span className="font-bold">Address:</span>
                <br />
                Gupta Trading Company(<Link to={"/"} className="text-blue-500 cursor-pointer" >www.retaildukaan.com</Link>), Kedar Das Nagar Near Kedia Petrol Pump Gurudwara Road
                Chas, BOKARO, Bokaro, Jharkhand, 827013
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8">
            <img src={logo} alt="logo" />
  
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
